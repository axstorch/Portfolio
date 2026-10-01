import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Section, Eyebrow, Container } from './Section';
import { WORK_DATA } from '../constants';
import { Link } from '../router';

/**
 * Diagram slot. Once a real file is added to the card's `image` field in
 * constants.ts this renders the image; until then it shows a labelled
 * placeholder rather than a broken frame or an invented chart.
 */
const WorkVisual: React.FC<{ src?: string; alt: string; slotLabel: string }> = ({
  src,
  alt,
  slotLabel,
}) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-contain"
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${alt}. Image pending: ${slotLabel}`}
      className="w-full h-full flex flex-col items-center justify-center gap-3 border border-dashed border-[#8B5E3C]/45 bg-[#FBF8F4] text-center px-6"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#8B5E3C]">
        {slotLabel}
      </span>
      <span className="text-xs text-[#6B5D50] max-w-[28ch] leading-[1.6]">{alt}</span>
    </div>
  );
};

const SelectedWork: React.FC = () => {
  return (
    <Section id="work" tone="light" aria-label="Selected work" className="py-20 md:py-28">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-12 border-b border-[#1C1C1C]/10 pb-6">
          <div>
            <Eyebrow>Case studies</Eyebrow>
            <h2 className="text-4xl md:text-6xl leading-[0.95]">
              Selected <br /> Work
            </h2>
          </div>
          <span className="text-sm uppercase tracking-widest text-[#666] mb-2">
            (0{WORK_DATA.length})
          </span>
        </div>

        <div className="space-y-16 md:space-y-24">
          {WORK_DATA.map((work, index) => {
            const flipped = index % 2 === 1;
            return (
              <article
                key={work.id}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                <div
                  className={`lg:col-span-7 relative aspect-[16/10] rounded-xl overflow-hidden bg-[#FBF8F4] ${
                    flipped ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <WorkVisual
                    src={work.image}
                    alt={work.imageAlt}
                    slotLabel={work.imageSlotLabel}
                  />
                </div>

                <div
                  className={`lg:col-span-5 flex flex-col justify-center space-y-5 ${
                    flipped ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs uppercase tracking-widest text-[#8B5E3C]">
                        {work.number}
                      </span>
                      {work.badge && (
                        <span className="px-2.5 py-1 rounded-full bg-[#1C1C1C]/8 border border-[#1C1C1C]/12 text-[10px] uppercase tracking-wider text-[#6B5D50]">
                          {work.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-serif">{work.title}</h3>
                    <p className="text-base text-[#8B5E3C] font-serif italic mt-1">
                      {work.subtitle}
                    </p>
                  </div>

                  <p className="text-base md:text-sm text-[#444] leading-[1.6] max-w-[60ch]">
                    {work.description}
                  </p>

                  <p className="text-base md:text-sm italic text-[#6B5D50] max-w-[60ch] leading-[1.6]">
                    {work.outcome}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {work.tags.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 border border-[#1C1C1C]/12 rounded-full text-[10px] uppercase tracking-wider text-[#555]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={work.href}
                    className="inline-flex items-center gap-1 self-start text-xs uppercase tracking-widest border-b border-[#1C1C1C] pb-1 hover:opacity-60 transition-opacity"
                  >
                    Read case study <ArrowUpRight size={12} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};

export default SelectedWork;
