import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Section, Eyebrow } from './Section';
import { CERTIFICATIONS_DATA } from '../constants';

/** Compact single row of small text links, per E3. */
const Certifications: React.FC = () => {
  return (
    <Section
      id="certifications"
      tone="cream"
      aria-label="Certifications"
      className="py-16 md:py-20 px-6 md:px-12"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-baseline gap-3 md:gap-8">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#8B5E3C] shrink-0 md:w-40">
            Certifications
          </h2>

          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {CERTIFICATIONS_DATA.map((c) => (
              <li key={c.title}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-baseline gap-1.5 text-sm text-[#333] hover:text-[#8B5E3C] transition-colors"
                >
                  {c.title}
                  <span className="text-[11px] text-[#7A6A5C]">{c.issuer}</span>
                  <ArrowUpRight
                    size={11}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
};

export default Certifications;
