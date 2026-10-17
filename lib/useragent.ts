/**
 * Shared user-agent parsing, used on both sides of the tracker.
 *
 * The browser cannot be trusted to report its own device, so the server
 * derives this from the raw UA header instead. Keeping the parser in one
 * place means the client and the server always agree on the wording.
 */

export interface DeviceInfo {
  /** Desktop, mobile, tablet, or bot. */
  device: string;
  /** Chrome, Safari, Edge, Firefox, or unknown. */
  browser: string;
  /** Windows, macOS, iOS, Android, Linux, or unknown. */
  os: string;
  isBot: boolean;
}

/**
 * Crawlers, link unfurlers and monitoring agents. A visit from these is not a
 * person reading the site, so it must never trigger an email.
 *
 * Slackbot, WhatsApp and LinkedInBot appear because LinkedIn, Slack and
 * WhatsApp fetch a URL whenever someone shares it, which is not a visit.
 */
const BOT_PATTERN =
  /bot\b|bot_|crawler|spider|crawling|slurp|scrapy|preview|facebookexternalhit|whatsapp|telegrambot|slackbot|discordbot|linkedinbot|embedly|quora link preview|pinterest|vkshare|skypeuripreview|headless|phantomjs|chrome-lighthouse|ahrefs|semrush|mj12|dotbot|petalbot|applebot|gptbot|chatgpt-user|perplexity|claudebot|ccbot|dataprovider|pingdom|gtmetrix|webpagetest/i;

export function isBotUserAgent(ua: string): boolean {
  if (!ua) return true;
  return BOT_PATTERN.test(ua);
}

/** Order matters: each check assumes the ones after it did not match. */
export function describeUserAgent(ua: string): DeviceInfo {
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
export function clean(value: unknown, max = 200): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
}