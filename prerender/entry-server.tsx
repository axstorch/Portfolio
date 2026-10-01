import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../App';
import { setPath } from '../router';

/**
 * Server entry used by the prerender step. Renders the full app for a given
 * route so the emitted HTML contains real content for crawlers and for
 * link unfurlers (LinkedIn, WhatsApp, Slack), which read raw HTML and do not
 * run JavaScript.
 */
export function render(url: string): string {
  setPath(url);
  return renderToString(React.createElement(App));
}
