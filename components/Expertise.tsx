import React from 'react';
import { Section, Eyebrow, Container } from './Section';
import { SKILLS_DATA } from '../constants';

/**
 * The single dark section. The fixed nav watches #expertise with an
 * IntersectionObserver and flips to its dark variant while this is under it.
 */
const Expertise: React.FC = () => {
  return (
    <Section id="expertise" tone="dark" aria-label="Expertise" className="py-20 md:py-28">
      <Container>
        <div className="mb-12">
          <Eyebrow dark>Toolkit</Eyebrow>
          <h2 className="text-4xl md:text-6xl leading-[0.95] font-serif text-[#F4F4F0]">
            Expertise &amp; <span className="italic font-light">Capabilities</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {SKILLS_DATA.map((category) => (
            <div key={category.category}>
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#C08457] mb-5 pb-3 border-b border-white/15">
                {category.category}
              </h3>
              <ul className="flex flex-wrap gap-2.5">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className="px-3.5 py-1.5 border border-white/15 rounded-full text-sm text-[#E8E2DA]"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default Expertise;
