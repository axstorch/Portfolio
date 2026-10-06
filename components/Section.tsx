import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  /** Section background. `dark` marks the single dark section. */
  tone?: 'light' | 'cream' | 'white' | 'stone' | 'dark';
  children: React.ReactNode;
  className?: string;
  'aria-labelledby'?: string;
  'aria-label'?: string;
}

const TONES: Record<string, string> = {
  light: 'bg-[#F4F4F0] text-[#1C1C1C]',
  cream: 'bg-[#FBF8F4] text-[#1C1C1C]',
  white: 'bg-white text-[#1C1C1C]',
  stone: 'bg-[#EBEAE5] text-[#1C1C1C]',
  dark: 'bg-[#1C1C1C] text-[#F4F4F0]',
};

/**
 * Every section carries scroll-margin-top so the fixed 64px nav never covers
 * a heading when an anchor link is followed. The tall value accounts for the
 * nav plus breathing room, matching the page's top padding.
 */
export const Section: React.FC<SectionProps> = ({
  id,
  tone = 'light',
  children,
  className = '',
  ...rest
}) => (
  <section
    id={id}
    data-section={id}
    className={`scroll-mt-24 md:scroll-mt-28 ${TONES[tone]} ${className}`}
    {...rest}
  >
    {children}
  </section>
);

/** Uppercase tracked label used above section headings. */
export const Eyebrow: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({
  children,
  dark,
}) => (
  <span
    className={`block text-xs uppercase tracking-[0.2em] mb-4 ${
      dark ? 'text-[#C08457]' : 'text-[#8B5E3C]'
    }`}
  >
    {children}
  </span>
);

/**
 * The one horizontal container. Every band on the page and the nav use it, so
 * the logo, the hero and every section share a left edge at every viewport
 * width. It owns the gutter padding too, which is why sections no longer set
 * px-6 md:px-12 themselves.
 *
 * 1600px rather than the old 1280px cap: at 1280 the page read as a narrow
 * ribbon down the middle of a wide desktop screen, with dead gutters either
 * side. The cap now sits above the common 1512px laptop so the measure only
 * stops growing on very large displays, and the gutter grows from 48px to 64px
 * at xl so wide screens do not look edge-to-edge cramped.
 *
 * Individual paragraphs still carry their own ch-based caps (46-62ch), so line
 * length stays readable at the wider measure.
 */
export const Container: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-[1600px] px-6 md:px-12 xl:px-16 ${className}`}>
    {children}
  </div>
);
