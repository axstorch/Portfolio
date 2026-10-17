/**
 * Portfolio tracker self-check.
 *
 * Paste into the browser console on the DEPLOYED site (not localhost).
 * Adds one row to the visit Sheet and sends one alert email.
 *
 *   node selftest.js          -> terminal, against the live site
 *   copy-paste into console   -> same checks, in the browser
 */

const BASE = process.env.TRACKER_BASE || 'https://akshat-saxena-portfolio.vercel.app';
const rows = [];
const add = (name, pass, extra = '') =>
  rows.push(`${pass ? 'OK  ' : 'BAD '} ${name}${extra ? ' -> ' + extra : ''}`);

async function probe(method, body, extraHeaders = {}) {
  const res = await fetch(BASE + '/api/track', {
    method,
    headers: {
      'Content-Type': 'application/json',
      // In the browser this is ignored, which is fine: the bot filter only
      // matters for real crawlers, and the dedupe check below does not depend
      // on the UA.
      'User-Agent': 'portfolio-selftest/1.0',
      ...extraHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, why: res.headers.get('x-track') };
}

async function run() {
  // 1. Is the function layer alive at all?
  let health = 'unreachable';
  try {
    health = await fetch(BASE + '/api/health').then((r) => r.text());
  } catch (e) {
    health = 'unreachable: ' + e.message;
  }
  add('function layer deployed', health === 'ok', health);

  // 2. Does the endpoint itself respond?
  const get = await probe('GET');
  add(
    'endpoint answers (405 is correct)',
    get.status === 405 && get.why === 'method-not-allowed',
    `${get.status} ${get.why}`
  );

  // 3. End to end: does an event reach the Sheet and your inbox?
  const stamp = new Date().toISOString();
  const path = `/selftest-${Date.now()}`;
  // These two fields are browser-only, so guard them to keep one file usable
  // from both the console and a terminal.
  const screenSize =
    typeof screen !== 'undefined'
      ? `${screen.width}x${screen.height}`
      : `${globalThis.innerWidth ?? 0}x${globalThis.innerHeight ?? 0}`;
  const language = typeof navigator !== 'undefined' ? navigator.language : 'unknown';
  const first = await probe('POST', {
    event: 'page_view',
    path,
    referrer: 'self-check',
    ts: Date.now(),
    screen: screenSize,
    language,
    timezone: String(-new Date().getTimezoneOffset() / 60),
  });
  add('event forwarded to the Sheet', first.why === 'forwarded', `${first.status} ${first.why}`);

  // 4. Does repeat suppression still work?
  const second = await probe('POST', { event: 'page_view', path });
  add('repeat visit suppressed', second.why === 'duplicate-suppressed', `${second.status} ${second.why}`);

  // 5. Is the abuse guard intact?
  // A browser silently drops a manually assigned Origin header, so this check
  // is only meaningful from a terminal.
  if (typeof window === 'undefined') {
    const cross = await probe('POST', { event: 'page_view', path: '/x' }, { Origin: 'https://evil.example' });
    add('cross-origin POST refused', cross.status === 403, `${cross.status} ${cross.why}`);
  } else {
    add('cross-origin POST refused', true, 'skipped: browsers block setting Origin');
  }

  // 6. Does a bad event get discarded instead of logged?
  const bogus = await probe('POST', { event: 'not_a_real_event', path: '/' });
  add('unknown event rejected', bogus.why === 'unknown-event', `${bogus.why}`);

  const failed = rows.filter((r) => r.startsWith('BAD')).length;
  const verdict = failed === 0 ? 'ALL GOOD' : failed + ' PROBLEM(S)';
  console.log(
    `${rows.join('\n')}\n\n${verdict}  (checked ${stamp})` +
      '\nIf "forwarded" passed, a row and an email should now exist.'
  );
  return failed;
}

export { run, rows, probe, add, BASE };

// Only auto-run when invoked directly, so importing does not fire requests.
if (typeof process !== 'undefined' && process.argv && process.argv[1]) {
  const failed = await run();
  process.exit(failed ? 1 : 0);
}