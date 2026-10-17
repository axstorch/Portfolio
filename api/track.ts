/**
 * POST /api/track
 *
 * The tracker has no backend of its own, so this endpoint is it. It exists to
 * do four things the browser cannot do for itself:
 *
 *   1. Drop bots and crawlers, using the real UA header rather than
 *      navigator.userAgent, so link unfurlers never send you an email.
 *   2. Attach geography, which only Vercel's edge knows (country, region,
 *      city). This is how you learn "someone from Bengaluru opened your
 *      Traya case study on an iPhone".
 *   3. Stop one visitor generating a burst of identical alerts. Each function
 *      instance keeps a short-lived memory of recent sends, so a reload loop
 *      or a double click produces one notification.
 *   4. Forward everything to the Google Apps Script webhook that owns the
 *      Sheet and the Gmail notification.
 *
 * Privacy: no cookies, no visitor ID, no IP address is stored or forwarded.
 * The IP is used in-memory, and only as a one-way SHA-256 digest, purely as
 * the de-duplication key. It is never written down and never leaves this
 * function.
 *
 * It always answers 204, even when the webhook is missing or broken, because
 * the site must keep working when the tracker does not.
 */

import { createHash } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';

import { clean, describeUserAgent } from '../lib/useragent';

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

/**
 * Events worth an immediate email. Page views are included because the whole
 * point is to know when a human lands on the site, and the de-duplication
 * window below keeps that from becoming noise.
 */
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

export const config = {
  maxDuration: 10,
};

function header(req: IncomingMessage, name: string): string {
  const v = req.headers[name];
  return Array.isArray(v) ? v[0] || '' : v || '';
}

async function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      // Node hands over Buffers, but a string chunk must not throw here.
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      size += buf.length;
      // Anything past the cap is a mistake or an attack, not a real event.
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
  // Cheap guard against unbounded growth on a long-lived instance.
  if (recent.size < 2000) return;
  for (const [key, at] of recent) {
    if (now - at > DEDUPE_WINDOW_MS) recent.delete(key);
  }
}

function firstForwardedIp(req: IncomingMessage): string {
  // Vercel sets x-forwarded-for to the visitor's address. x-real-ip is a
  // fallback for local `vercel dev` and proxied setups.
  const fwd = header(req, 'x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return header(req, 'x-real-ip') || header(req, 'x-vercel-forwarded-for');
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  // Nothing about a visit should ever be cached.
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end();
    return;
  }

  // Only this site's own pages may write to the endpoint. Without this,
  // anyone could POST to it from their own site and fill your inbox.
  const origin = header(req, 'origin');
  if (origin) {
    try {
      if (new URL(origin).host !== header(req, 'host')) {
        res.statusCode = 403;
        res.end();
        return;
      }
    } catch {
      res.statusCode = 403;
      res.end();
      return;
    }
  }

  let raw: string;
  try {
    raw = await readBody(req);
  } catch {
    res.statusCode = 204;
    res.end();
    return;
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw || '{}');
  } catch {
    res.statusCode = 204;
    res.end();
    return;
  }

  const event = clean(body.event, 40);
  if (!ALLOWED_EVENTS.has(event)) {
    res.statusCode = 204;
    res.end();
    return;
  }

  const ua = header(req, 'user-agent');
  const info = describeUserAgent(ua);
  if (info.isBot) {
    res.statusCode = 204;
    res.end();
    return;
  }

  const ip = firstForwardedIp(req);
  // Digest, not the address. This is the de-duplication key and nothing else.
  const visitorKey = ip ? createHash('sha256').update(ip).digest('hex').slice(0, 16) : 'no-ip';

  const path = clean(body.path, 120) || '/';
  // A case study route is reported under its own name so the report can lead
  // with it: "opened the Traya case study".
  const isCaseStudy = path.startsWith('/work/');
  const reportedEvent = isCaseStudy && event === 'page_view' ? 'case_study_view' : event;

  const now = Date.now();
  prune(now);

  const window = event === 'page_view' ? PAGE_VIEW_DEDUPE_MS : DEDUPE_WINDOW_MS;
  const key = `${visitorKey}:${reportedEvent}:${path}`;
  const lastSent = recent.get(key) || 0;
  if (now - lastSent < window) {
    res.statusCode = 204;
    res.end();
    return;
  }
  recent.set(key, now);

  const referrer =
    clean(body.referrer, 300) || header(req, 'referer').slice(0, 300) || '';

  const payload = {
    v: 1,
    event: reportedEvent,
    alert: ALERT_EVENTS.has(reportedEvent),
    ts: new Date(now).toISOString(),
    path,
    referrer,
    // Geography from Vercel's edge. Absent on localhost, and country can be
    // "XX" for a VPN or an unresolvable address, which is worth knowing.
    country: clean(header(req, 'x-vercel-ip-country'), 8),
    region: clean(header(req, 'x-vercel-ip-country-region'), 60),
    city: clean(header(req, 'x-vercel-ip-city'), 60),
    device: info.device,
    browser: info.browser,
    os: info.os,
    screen: clean(body.screen, 20),
    viewport: clean(body.viewport, 20),
    language: clean(body.language, 20),
    timezone: clean(body.timezone, 10),
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
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      // A slow Sheet append must not hold the visitor's request open.
      signal: AbortSignal.timeout(4000),
    });
  } catch (err) {
    console.error('[track] webhook delivery failed:', (err as Error).message);
  }

  res.statusCode = 204;
  res.end();
}