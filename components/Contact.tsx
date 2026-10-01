import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Section, Container } from './Section';
import { RESUME_DATA } from '../constants';

const Contact: React.FC = () => {
  return (
    <footer
      id="contact"
      data-section="contact"
      className="scroll-mt-24 md:scroll-mt-28 py-20 md:py-28 bg-[#F4F4F0] text-[#1C1C1C]"
    >
      <Container className="text-center">
        <h2 className="text-4xl md:text-6xl font-serif mb-8">Let's talk</h2>

        <a
          href={`mailto:${RESUME_DATA.email}`}
          className="inline-block text-xl md:text-2xl border-b border-[#1C1C1C] pb-1 hover:opacity-70 transition-opacity mb-12"
        >
          {RESUME_DATA.email}
        </a>

        <ul className="flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { label: 'LinkedIn', href: RESUME_DATA.linkedin },
            { label: 'GitHub', href: RESUME_DATA.github },
            { label: 'Resume', href: RESUME_DATA.resume },
          ].map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="uppercase tracking-widest text-xs font-bold inline-flex items-center gap-1 hover:opacity-60 transition-opacity"
              >
                {l.label} <ArrowUpRight size={12} />
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-24 pt-8 border-t border-[#1C1C1C]/10 flex flex-wrap justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-[#666]">
          <span>&copy; {new Date().getFullYear()} Akshat Saxena</span>
          <a href="#bts" className="hover:opacity-60 transition-opacity">
            Behind the Scenes
          </a>
        </div>
      </Container>
    </footer>
  );
};

export default Contact;
