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
