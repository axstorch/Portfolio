import React, { useEffect, useState, useCallback } from 'react';

/**
 * Minimal history-based router.
 *
 * Kept deliberately small: the site has one index route and three static case
 * study routes, and the same module is used by the prerender step, which sets
 * the path directly through setPath() before calling renderToString.
 */

let currentPath =
  typeof window !== 'undefined' ? normalise(window.location.pathname) : '/';

const listeners = new Set<() => void>();

function normalise(path: string): string {
  if (!path) return '/';
  // Trailing slashes are collapsed so /work/newme/ matches /work/newme
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

export function getPath(): string {
  return currentPath;
}

/** Used by the prerender step to render a specific route. */
export function setPath(path: string): void {
  currentPath = normalise(path);
  notify();
}

function notify(): void {
  listeners.forEach((fn) => fn());
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    currentPath = normalise(window.location.pathname);
    notify();
  });
}

export function usePath(): string {
  const [path, setLocal] = useState(currentPath);

  useEffect(() => {
    const fn = () => setLocal(currentPath);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);

  return path;
}

export function navigate(to: string): void {
  if (normalise(to) === currentPath) return;
  if (typeof window !== 'undefined') {
    window.history.pushState({}, '', to);
  }
  currentPath = normalise(to);
  notify();
  if (typeof window !== 'undefined') window.scrollTo(0, 0);
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  /** Set false for in-page anchors such as #work. */
  client?: boolean;
}

export const Link: React.FC<LinkProps> = ({ to, client = true, children, ...rest }) => {
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!client) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      navigate(to);
    },
    [to, client]
  );

  return (
    <a href={to} onClick={onClick} {...rest}>
      {children}
    </a>
  );
};

/** True when the given path is the case study page with this slug. */
export const isCaseStudy = (path: string, slug: string): boolean =>
  path === `/work/${slug}`;
