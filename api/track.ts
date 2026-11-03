/**
 * POST /api/track
 *
 * The tracker has no backend of its own, so this endpoint is it. It exists to
 * do the things the browser cannot do for itself:
 *
 *   1. Drop bots and crawlers, using the real UA header rather than
 *      navigator.userAgent, so link unfurlers never send you an email.
 *   2. Catch the bots that pretend to be Chrome. Link-safety scanners (email,
 *      LinkedIn, applicant tracking systems) open shared links from cloud data
 *      centres in real headless Chrome with a normal UA. Their giveaway is that
 *      the browser's timezone does not match where the IP actually is, or
 *      the IP sits in a data-centre town. Those visits are forwarded as
 *      `suspect`, logged to a separate tab, and never emailed.
 *   3. Attach geography, which only Vercel's edge knows (country, region,
 *      city).
 *   4. Stop one visitor generating a burst of identical alerts (per instance;
 *      the Apps Script repeats this across instances).
 *   5. Forward everything to the Google Apps Script webhook that owns the
 *      Sheet and the Gmail notification.
 *
 * Privacy: no cookies, no visitor ID, no IP address is stored or forwarded.
 * The IP is used in-memory, and only as a one-way SHA-256 digest, purely as
 * the de-duplication key. It is never written down and never leaves this
 * function.
 *
 * It always answers 204, even when the webhook is missing or broken, because
 * the site must keep working when the tracker does not. The X-Track response
 * header says why each request ended where it did.
 *
 * ------------------------------------------------------------------
 * THIS FILE IS DELIBERATELY SELF-CONTAINED. DO NOT IMPORT ../lib/*.
 * ------------------------------------------------------------------
 * Vercel builds a function from its own entrypoint and does not reliably
 * bundle files from outside api/, so an import from ../lib made every request
 * die with FUNCTION_INVOCATION_FAILED. The client keeps using
 * lib/useragent.ts, so the two copies below can drift apart; if you change
 * the bot pattern here, change it there too.
 */

import { createHash } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';

/* ------------------------------------------------------------------ */
/* UA parsing, duplicated from lib/useragent.ts on purpose             */
/* ------------------------------------------------------------------ */

/**
 * Crawlers, link unfurlers and monitoring agents. A visit from these is not a
 * person reading the site, so it must never trigger an email.
 */
const BOT_PATTERN =
  /bot\b|bot_|crawler|spider|crawling|slurp|scrapy|preview|facebookexternalhit|whatsapp|telegrambot|slackbot|discordbot|linkedinbot|embedly|quora link preview|pinterest|vkshare|skypeuripreview|headless|phantomjs|chrome-lighthouse|ahrefs|semrush|mj12|dotbot|petalbot|applebot|gptbot|chatgpt-user|perplexity|claudebot|ccbot|dataprovider|pingdom|gtmetrix|webpagetest/i;

interface DeviceInfo {
  device: string;
  browser: string;
  os: string;
  isBot: boolean;
}

function isBotUserAgent(ua: string): boolean {
  if (!ua) return true;
  return BOT_PATTERN.test(ua);
}

/** Order matters: each check assumes the ones after it did not match. */
function describeUserAgent(ua: string): DeviceInfo {
  const isBot = isBotUserAgent(ua);
  const s = (ua || '').toLowerCase();

  let device = 'Desktop';
  if (isBot) {
    device = 'Bot';
  } else if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(s)) {
    device = 'Tablet';
  } else if (/mobi|iphone|ipod|android|blackberry|windows phone|opera mini/.test(s)) {
    device = 'Mobile';
  }

  let browser = 'Other';
  if (/edg\//.test(s)) browser = 'Edge';
  else if (/opr\/|opera/.test(s)) browser = 'Opera';
  else if (/samsungbrowser/.test(s)) browser = 'Samsung Internet';
  else if (/firefox\/|fxios/.test(s)) browser = 'Firefox';
  else if (/chrome\/|crios/.test(s)) browser = 'Chrome';
  else if (/safari\//.test(s)) browser = 'Safari';
  else if (/curl\/|wget\/|python-requests|node-fetch|axios|go-http-client/.test(s)) browser = 'Script';

  let os = 'Other';
  if (/windows/.test(s)) os = 'Windows';
  else if (/iphone|ipad|ipod/.test(s)) os = 'iOS';
  else if (/android/.test(s)) os = 'Android';
  else if (/mac os x|macintosh/.test(s)) os = 'macOS';
  else if (/cros/.test(s)) os = 'ChromeOS';
  else if (/linux|x11/.test(s)) os = 'Linux';

  return { device, browser, os, isBot };
}

/**
 * Trims and hard-caps any free-text field before it is forwarded, so a
 * crafted referrer or label cannot bloat the log or inject line breaks into
 * the notification email.
 */
function clean(value: unknown, max = 200): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
}

/** Vercel URL-encodes geo headers ("Des%20Moines"). */
function decodeHeader(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/* ------------------------------------------------------------------ */
/* Bot heuristics for browsers that claim to be Chrome                 */
/* ------------------------------------------------------------------ */

/**
 * Small towns whose internet traffic is overwhelmingly cloud data centres
 * (Microsoft Azure, AWS, Google). Large cities that happen to host data
 * centres (San Jose, Des Moines, Dublin) are deliberately left out: real
 * people live there, and the timezone check catches the scanners anyway.
 * Lower case, compared against the decoded city.
 */
const DATACENTRE_TOWNS = new Set([
  'boydton',
  'moses lake',
  'quincy',
  'dulles town',
  'ashburn',
  'the dalles',
  'prineville',
  'council bluffs',
  'cheyenne',
  'san antonio de los altos',
]);

/** Signals the client is allowed to report. Anything else is ignored. */
const CLIENT_SIGNALS = new Set(['webdriver', 'no-languages']);

/**
 * Current UTC offset of an IANA timezone in hours, e.g. "Asia/Kolkata" -> 5.5.
 * Uses the current date, so daylight saving is handled the same way the
 * visitor's browser handles it.
 */
function offsetHours(tz: string, at = new Date()): number | null {
  try {
    const part =
      new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' })
        .formatToParts(at)
        .find((p) => p.type === 'timeZoneName')?.value ?? '';
    if (part === 'GMT' || part === 'UTC') return 0;
    const m = part.match(/(?:GMT|UTC)([+-])(\d{1,2})(?::(\d{2}))?/);
    if (!m) return null;
    const hours = Number(m[2]) + Number(m[3] || 0) / 60;
    return m[1] === '-' ? -hours : hours;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Endpoint                                                            */
/* ------------------------------------------------------------------ */

/** Events the site is allowed to send. Anything else is discarded. */
const ALLOWED_EVENTS = new Set([
  'page_view',
  'case_study_click',
  'resume_click',
  'document_click',
  'outbound_click',
  'contact_click',
  'engagement',
  'error',
]);

/** Events worth an immediate email, unless the visit is a suspect. */
const ALERT_EVENTS = new Set([
  'page_view',
  'case_study_click',
  'case_study_view',
  'resume_click',
  'contact_click',
]);

/**
 * How long the same visitor and the same event are collapsed into one
 * notification. Long enough to survive a reload or a click that navigates,
 * short enough that a genuine second visit later still gets through.
 */
const DEDUPE_WINDOW_MS = 5 * 60 * 1000;

/** Page views get a tighter window: they are the noisiest event. */
const PAGE_VIEW_DEDUPE_MS = 60 * 1000;

const MAX_BODY_BYTES = 4096;

/**
 * In-memory only. Every key is a digest, and the map is empty on cold start,
 * so nothing here survives the instance.
 */
const recent = new Map<string, number>();

let warnedAboutMissingWebhook = false;

function header(req: IncomingMessage, name: string): string {
  const v = req.headers[name];
  return Array.isArray(v) ? v[0] || '' : v || '';
}

async function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      size += buf.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('body too large'));
        req.destroy();
        return;
      }
      chunks.push(buf);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function prune(now: number): void {
  if (recent.size < 2000) return;
  for (const [key, at] of recent) {
    if (now - at > DEDUPE_WINDOW_MS) recent.delete(key);
  }
}

/**
 * Ends the request and records *why*, in an X-Track header. The header
 * reveals only the outcome, never the webhook URL.
 */
function respond(res: ServerResponse, code: number, why: string): void {
  res.setHeader('X-Track', why);
  res.statusCode = code;
  res.end();
}

function firstForwardedIp(req: IncomingMessage): string {
  const fwd = header(req, 'x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return header(req, 'x-real-ip') || header(req, 'x-vercel-forwarded-for');
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    respond(res, 405, 'method-not-allowed');
    return;
  }

  // Only this site's own pages may write to the endpoint.
  const origin = header(req, 'origin');
  if (origin) {
    try {
      if (new URL(origin).host !== header(req, 'host')) {
        respond(res, 403, 'origin-rejected');
        return;
      }
    } catch {
      respond(res, 403, 'origin-rejected');
      return;
    }
  }

  let raw: string;
  try {
    raw = await readBody(req);
  } catch {
    respond(res, 204, 'body-too-large');
    return;
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw || '{}');
  } catch {
    respond(res, 204, 'malformed-body');
    return;
  }

  const event = clean(body.event, 40);
  if (!ALLOWED_EVENTS.has(event)) {
    respond(res, 204, 'unknown-event');
    return;
  }

  const ua = header(req, 'user-agent');
  const info = describeUserAgent(ua);
  if (info.isBot) {
    respond(res, 204, 'bot-filtered');
    return;
  }

  /*
   * The client only sends after a trusted mouse, touch, wheel or key event.
   * A request without the flag is either a scanner that never interacted
   * (it should not have sent anything) or a script POSTing directly.
   */
  if (body.interacted !== true) {
    respond(res, 204, 'no-interaction');
    return;
  }

  const signals = clean(body.signals, 80)
    .split(',')
    .map((s) => s.trim())
    .filter((s) => CLIENT_SIGNALS.has(s));

  // Puppeteer, Playwright and Selenium set navigator.webdriver. Certain: drop.
  if (signals.includes('webdriver')) {
    respond(res, 204, 'automation-filtered');
    return;
  }

  // Geography from Vercel's edge. Absent on localhost.
  const country = clean(decodeHeader(header(req, 'x-vercel-ip-country')), 8);
  const region = clean(decodeHeader(header(req, 'x-vercel-ip-country-region')), 60);
  const city = clean(decodeHeader(header(req, 'x-vercel-ip-city')), 60);
  const ipTimezone = clean(decodeHeader(header(req, 'x-vercel-ip-timezone')), 60);

  /*
   * Scanners run in cloud regions but their browsers all report the same
   * default timezone: in your sheet, Virginia and Iowa visits claimed UTC-7.
   * A person's laptop clock agrees with where their IP is. VPN users and
   * travellers can trip this, which is why it marks a suspect for the
   * Filtered tab instead of discarding the event.
   */
  const timezone = clean(body.timezone, 10);
  const clientOffset = Number(timezone);
  const ipOffset = ipTimezone ? offsetHours(ipTimezone) : null;
  if (
    ipOffset !== null &&
    timezone !== '' &&
    Number.isFinite(clientOffset) &&
    Math.abs(ipOffset - clientOffset) >= 1
  ) {
    signals.push('tz-mismatch');
  }

  if (DATACENTRE_TOWNS.has(city.toLowerCase())) signals.push('datacentre-town');

  const suspect = signals.length > 0;

  const ip = firstForwardedIp(req);
  const visitorKey = ip ? createHash('sha256').update(ip).digest('hex').slice(0, 16) : 'no-ip';

  const path = clean(body.path, 120) || '/';
  const isCaseStudy = path.startsWith('/work/');
  const reportedEvent = isCaseStudy && event === 'page_view' ? 'case_study_view' : event;

  const now = Date.now();
  prune(now);

  const window = event === 'page_view' ? PAGE_VIEW_DEDUPE_MS : DEDUPE_WINDOW_MS;
  const key = `${visitorKey}:${reportedEvent}:${path}`;
  const lastSent = recent.get(key) || 0;
  if (now - lastSent < window) {
    respond(res, 204, 'duplicate-suppressed');
    return;
  }
  recent.set(key, now);

  const referrer = clean(body.referrer, 300) || header(req, 'referer').slice(0, 300) || '';

  const payload = {
    v: 2,
    event: reportedEvent,
    alert: !suspect && ALERT_EVENTS.has(reportedEvent),
    suspect,
    signals: signals.join(','),
    ipTimezone,
    ts: new Date(now).toISOString(),
    path,
    referrer,
    country,
    region,
    city,
    device: info.device,
    browser: info.browser,
    os: info.os,
    screen: clean(body.screen, 20),
    viewport: clean(body.viewport, 20),
    language: clean(body.language, 20),
    timezone,
    target: clean(body.target, 120),
    label: clean(body.label, 80),
    durationMs: typeof body.durationMs === 'number' ? Math.round(body.durationMs) : 0,
  };

  const webhook = process.env.TRACK_WEBHOOK_URL;
  if (!webhook) {
    if (!warnedAboutMissingWebhook) {
      console.warn('[track] TRACK_WEBHOOK_URL is not set, events are being dropped.');
      warnedAboutMissingWebhook = true;
    }
    respond(res, 204, 'no-webhook-configured');
    return;
  }

  try {
    const delivered = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000),
    });

    if (!delivered.ok) {
      console.error(
        `[track] webhook responded ${delivered.status}. Check that TRACK_WEBHOOK_URL ends in /exec ` +
          'and that the Apps Script deployment allows access from Anyone.'
      );
      respond(res, 204, `webhook-error-${delivered.status}`);
      return;
    }
  } catch (err) {
    console.error('[track] webhook delivery failed:', (err as Error).message);
    respond(res, 204, 'webhook-unreachable');
    return;
  }

  respond(res, 204, suspect ? `forwarded-suspect:${signals.join(',')}` : 'forwarded');
}
