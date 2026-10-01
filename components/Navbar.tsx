import React, { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { RESUME_DATA } from '../constants';
import { Link, navigate } from '../router';
import { Container } from './Section';

/** Height of the fixed bar, in px. Kept in sync with the h-16 class below. */
export const NAV_HEIGHT = 64;

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Posts', href: '#posts' },
  { label: 'Contact', href: '#contact' },
];

/** Section id whose dark background the bar has to adapt to. */
const DARK_SECTION_ID = 'expertise';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  /* Solid background once the page moves, so the bar never sits on content. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Swap to the dark variant while the Expertise section sits under the bar. */
  useEffect(() => {
    const target = document.getElementById(DARK_SECTION_ID);
    if (!target) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // isIntersecting with a 0px root margin means the section's top edge
        // has crossed the top of the viewport, so the bar is over it.
        setOverDark(entry.isIntersecting);
      },
      { rootMargin: `-${NAV_HEIGHT}px 0px 0px 0px`, threshold: 0 }
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  /* Escape closes the overlay. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  /* Focus moves into the overlay on open and returns to the toggle on close. */
  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement as HTMLElement;
      const first = overlayRef.current?.querySelector<HTMLElement>('a, button');
      first?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (lastFocus.current) lastFocus.current.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  /* Keep Tab inside the overlay while it is open. */
  const onTrapKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return;
    const nodes = overlayRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    if (!nodes || nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const dark = overDark;

  /* At the very top of the page the bar is transparent so the hero reads full-bleed. */
  const transparent = !scrolled && !dark;

  const go = (href: string) => {
    setOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    navigate(href);
  };

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-[100] h-16 transition-colors duration-300',
          dark
            ? 'bg-[#1C1C1C]/85 backdrop-blur-[12px] border-b border-white/10'
            : scrolled
              ? 'bg-[#F4F4F0]/80 backdrop-blur-[12px] border-b border-[#1C1C1C]/10'
              : 'bg-transparent border-b border-transparent',
        ].join(' ')}
      >
        <Container className="h-full flex items-center justify-between">
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`font-serif text-xl font-bold tracking-tight transition-colors ${
              dark ? 'text-[#F4F4F0]' : transparent ? 'text-[#1C1C1C]' : 'text-[#1C1C1C]'
            }`}
          >
            Akshat S.
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      go(l.href);
                    }}
                    className={[
                      'text-[13px] uppercase tracking-widest transition-colors',
                      dark ? 'text-[#F4F4F0]/85 hover:text-[#F4F4F0]' : 'text-[#1C1C1C]/70 hover:text-[#1C1C1C]',
                    ].join(' ')}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={RESUME_DATA.resume}
              target="_blank"
              rel="noreferrer"
              className={[
                'hidden md:inline-flex items-center text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-colors',
                dark
                  ? 'border-white/30 text-[#F4F4F0] hover:border-white'
                  : 'border-[#1C1C1C]/25 text-[#1C1C1C] hover:border-[#1C1C1C]',
              ].join(' ')}
            >
              Resume
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className={`md:hidden w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${
                dark || open
                  ? 'border-white/25 text-[#F4F4F0]'
                  : 'border-[#1C1C1C]/20 text-[#1C1C1C]'
              }`}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </Container>
      </header>

      {/* Full-screen mobile overlay */}
      {open && (
        <div
          id="mobile-nav"
          ref={overlayRef}
          onKeyDown={onTrapKey}
          className="md:hidden fixed inset-0 z-[101] bg-[#1C1C1C] text-[#F4F4F0] flex flex-col items-center justify-center gap-2"
        >
          <ul className="flex flex-col items-center gap-5 text-center px-6">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    go(l.href);
                  }}
                  className="font-serif text-3xl hover:italic transition-all"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={RESUME_DATA.resume}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="mt-6 text-xs uppercase tracking-widest border-b border-white/40 pb-1"
          >
            Download Resume
          </a>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              go('#bts');
            }}
            className="mt-2 text-[11px] uppercase tracking-widest text-white/40"
          >
            Behind the Scenes
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
