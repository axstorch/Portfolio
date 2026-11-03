/**
 * Cookie-less visit tracking.
 *
 * No cookies, no localStorage, no visitor ID. Each event is a POST to
 * /api/track carrying only what a single request needs, so there is nothing
 * to identify a visitor across sessions.
 *
 * Honoured automatically:
 *   - Do Not Track / Global Privacy Control  -> nothing is sent at all
 *   - `?track=0` in the URL                 -> opt out for one visit
 *   - `window.__PORTFOLIO_TRACKING__ = false` from the console -> opt out
 *
 * Human gate: nothing is sent until the visitor produces a trusted mouse,
 * touch, wheel or keyboard event. Link scanners load the page in headless
 * Chrome and leave without touching it, so their page views sit in the queue
 * and die with the tab. Real readers scroll or move the mouse within seconds,
 * and the queued page view is sent at that moment.
 *
 * The tracker is best effort. Every call is fire-and-forget and failures are
 * swallowed, so a missing or broken endpoint can never break the page.
 */

import { isBotUserAgent } from './useragent';

const ENDPOINT = '/api/track';

export type EventName =
  | 'page_view'
  | 'case_study_click'
  | 'resume_click'
  | 'document_click'
  | 'outbound_click'
  | 'contact_click'
  | 'engagement'
  | 'error';

interface EventProps {
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    __PORTFOLIO_TRACKING__?: boolean;
  }
}

export function trackingEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.__PORTFOLIO_TRACKING__ === false) return false;
  if (new URLSearchParams(window.location.search).get('track') === '0') return false;
  const dnt = (navigator as { globalPrivacyControl?: boolean }).globalPrivacyControl;
  if (navigator.doNotTrack === '1' || dnt === true) return false;
  return true;
}

/* ------------------------------------------------------------------ */
/* Human gate                                                          */
/* ------------------------------------------------------------------ */

/**
 * Events that prove a person is there. `scroll` is deliberately absent: a
 * script calling window.scrollTo() produces scroll events too. A trackpad or
 * wheel produces `wheel`, dragging the scrollbar produces `pointerdown`, and
 * a phone produces `touchstart`.
 */
const HUMAN_EVENTS = ['pointerdown', 'pointermove', 'wheel', 'touchstart', 'keydown'] as const;

/** Enough for a few route changes before the first interaction. */
const MAX_QUEUED = 10;

let interacted = false;
let listening = false;
const queue: Record<string, unknown>[] = [];

function onInteraction(e: Event): void {
  // isTrusted is false for events created by page scripts (el.click(), etc).
  if (!e.isTrusted || interacted) return;
  interacted = true;
  for (const t of HUMAN_EVENTS) window.removeEventListener(t, onInteraction, true);
  for (const body of queue.splice(0)) post({ ...body, interacted: true });
}

function listenForInteraction(): void {
  if (listening || typeof window === 'undefined') return;
  listening = true;
  for (const t of HUMAN_EVENTS) {
    window.addEventListener(t, onInteraction, { capture: true, passive: true });
  }
}

/** Automation fingerprints. The server decides what to do with them. */
function automationSignals(): string[] {
  const s: string[] = [];
  // Set by Puppeteer, Playwright and Selenium unless deliberately hidden.
  if (navigator.webdriver) s.push('webdriver');
  if (!navigator.languages || navigator.languages.length === 0) s.push('no-languages');
  return s;
}

function timezoneName(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    return '';
  }
}

/* ------------------------------------------------------------------ */
/* Sending                                                             */
/* ------------------------------------------------------------------ */

function deviceSnapshot(): EventProps {
  return {
    screen: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language,
    // UTC offset in hours, e.g. "5.5" for IST. The server compares this with
    // the timezone of the visitor's IP to spot data-centre browsers.
    timezone: (-new Date().getTimezoneOffset() / 60).toString(),
    tzName: timezoneName(),
  };
}

function post(body: Record<string, unknown>): void {
  try {
    const payload = JSON.stringify({ v: 2, ...body });
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
      mode: 'same-origin',
      credentials: 'omit',
    }).catch(() => {
      /* tracking is never allowed to surface an error */
    });
  } catch {
    /* ignore */
  }
}

export function track(name: EventName, props: EventProps = {}): void {
  if (!trackingEnabled()) return;
  // Cheap pre-filter; the server repeats this against the real UA header.
  if (isBotUserAgent(navigator.userAgent)) return;

  const signals = automationSignals();
  if (signals.includes('webdriver')) return;

  listenForInteraction();

  const body = {
    event: name,
    path: window.location.pathname,
    referrer: document.referrer || '',
    ts: Date.now(),
    signals: signals.join(','),
    ...deviceSnapshot(),
    ...props,
  };

  if (interacted) {
    post({ ...body, interacted: true });
  } else if (queue.length < MAX_QUEUED) {
    queue.push(body);
  }
}

/** Route-level view. Case study routes are tagged by the server as such. */
export function trackPageView(path: string): void {
  track('page_view', { path });
}

/** The nearest labelled anchor, used for the click text in the report. */
function anchorLabel(a: HTMLAnchorElement): string {
  const explicit = a.getAttribute('aria-label') || a.getAttribute('title');
  return (explicit || a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
}

function hostOf(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return 'external';
  }
}

/**
 * Classifies an anchor by its destination, so every outbound link on the site
 * is covered without adding tracking attributes to each component.
 * An explicit `data-track` attribute always wins.
 */
function classify(a: HTMLAnchorElement): { name: EventName; target: string } | null {
  const explicit = a.getAttribute('data-track');
  if (explicit) return { name: explicit as EventName, target: 'explicit' };

  const href = a.getAttribute('href') || '';

  if (href.startsWith('mailto:') || href.startsWith('tel:')) {
    return { name: 'contact_click', target: href.split(':')[0] };
  }

  /*
   * Any PDF or Google Drive link is a document, but only one of them is the
   * resume. The rest are certificates and case study attachments, so the
   * text decides.
   */
  if (href.includes('drive.google.com') || /\.pdf(\?|$)/i.test(href)) {
    const described = `${a.getAttribute('aria-label') || ''} ${a.textContent || ''} ${href}`;
    if (/resume|curriculum vitae|\bcv\b/i.test(described)) {
      return { name: 'resume_click', target: 'resume' };
    }
    return { name: 'document_click', target: hostOf(href) };
  }

  if (/^\/work\/[a-z0-9-]+/.test(href)) {
    return { name: 'case_study_click', target: href };
  }
  if (/linkedin\.com/.test(href)) {
    return { name: 'outbound_click', target: 'linkedin' };
  }
  if (/github\.com/.test(href)) {
    return { name: 'outbound_click', target: 'github' };
  }
  if (/^https?:\/\//.test(href)) {
    return { name: 'outbound_click', target: hostOf(href) };
  }
  return null;
}

/**
 * Wires up the single delegated listener that covers every link on the site,
 * and starts listening for the first human interaction.
 */
export function initTracking(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  listenForInteraction();

  document.addEventListener(
    'click',
    (e) => {
      // Synthetic clicks from page scripts or scanners are not a person.
      if (!e.isTrusted) return;
      const a = (e.target as HTMLElement | null)?.closest?.('a');
      if (!a) return;
      const hit = classify(a as HTMLAnchorElement);
      if (!hit) return;
      track(hit.name, { target: hit.target, label: anchorLabel(a as HTMLAnchorElement) });
    },
    { capture: true, passive: true }
  );
}
