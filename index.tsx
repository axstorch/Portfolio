import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initTracking } from './lib/analytics';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

/*
 * One delegated click listener covers every link on the site, so tracking is
 * live before the first render. It is a no-op for visitors who send Do Not
 * Track, and it never touches the page's behaviour.
 */
initTracking();

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
