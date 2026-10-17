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

/** Set from the console to switch tracking off entirely. */
declare global {
  interface Window {
    __PORTFOLIO_TRACKING__?: boolean;
  }
}

export function trackingEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.__PORTFOLIO_TRACKING__ === false) return false;
  // Per-visit opt out, useful for testing and for sharing the link privately.
  if (new URLSearchParams(window.location.search).get('track') === '0') return false;
  // Do Not Track: '1' means do not track. GPC is the newer equivalent.
  const dnt = (navigator as { globalPrivacyControl?: boolean }).globalPrivacyControl;
  if (navigator.doNotTrack === '1' || dnt === true) return false;
  return true;
}

function deviceSnapshot(): EventProps {
  return {
    screen: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language,
    // UTC offset in hours, e.g. "5.5" for IST, which is a weak location hint.
    timezone: (-new Date().getTimezoneOffset() / 60).toString(),
  };
}

function post(body: Record<string, unknown>): void {
  try {
    const payload = JSON.stringify({ v: 1, ...body });
    // keepalive lets an event survive the page unloading, which is exactly
    // what happens when someone clicks "Read case study" and navigates.
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
  // Cheap pre-filter so obvious bots never even reach the network. The
  // server repeats this check against the real UA header.
  if (isBotUserAgent(navigator.userAgent)) return;

  post({
    event: name,
    path: window.location.pathname,
    referrer: document.referrer || '',
    ts: Date.now(),
    ...deviceSnapshot(),
    ...props,
  });
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
 *
 * An explicit `data-track` attribute always wins, so a specific link can be
 * overridden later without touching this table.
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
   * text decides. Getting this wrong would email "resume downloaded" when
   * somebody opened a Coursera certificate.
   */
  if (href.includes('drive.google.com') || /\.pdf(\?|$)/i.test(href)) {
    const described = `${a.getAttribute('aria-label') || ''} ${a.textContent || ''} ${href}`;
    if (/resume|curriculum vitae|\bcv\b/i.test(described)) {
      return { name: 'resume_click', target: 'resume' };
    }
    return { name: 'document_click', target: hostOf(href) };
  }

  // Internal case study routes are the "View" action. The page_view that
  // follows covers the read itself; this records the intent to open it.
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
  // In-page anchors and the custom router's links are not interesting.
  return null;
}

/**
 * Wires up the single delegated listener that covers every link on the site.
 * Delegation is used rather than per-link handlers so new links are tracked
 * automatically as content changes.
 */
export function initTracking(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a');
      if (!a) return;
      const hit = classify(a as HTMLAnchorElement);
      if (!hit) return;
      track(hit.name, { target: hit.target, label: anchorLabel(a as HTMLAnchorElement) });
    },
    { capture: true, passive: true }
  );

  // Bots that execute JS would otherwise fire the listeners above. The UA
  // check inside track() handles that; nothing more is needed here.
}