import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Section, Eyebrow } from './Section';
import { ALSO_BUILT, PROJECTS_DATA } from '../constants';
import { Link } from '../router';

const AlsoBuilt: React.FC = () => {
  return (
    <Section id="also-built" tone="cream" aria-label="Also built" className="py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <Eyebrow>Side work</Eyebrow>
          <h2 className="text-3xl md:text-5xl leading-[0.95] font-serif">
            Also <span className="italic font-light">Built</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1C1C1C]/10 rounded-2xl overflow-hidden border border-[#1C1C1C]/10">
          {ALSO_BUILT.map((item, i) => {
            const project = PROJECTS_DATA.find((p) => p.id === item.id);
            return (
              <div key={item.id} className="bg-[#FBF8F4] p-7 md:p-8 flex flex-col">
                <h3 className="text-xl font-serif mb-3">{item.title}</h3>
                <p className="text-base md:text-sm text-[#444] leading-[1.6] max-w-[46ch] mb-5">
                  {item.description}
                </p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 border border-[#1C1C1C]/12 rounded-full text-[10px] uppercase tracking-wider text-[#555]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {project?.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-[#8B5E3C] hover:opacity-70 transition-opacity"
                    >
                      GitHub <ArrowUpRight size={12} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};

export default AlsoBuilt;
