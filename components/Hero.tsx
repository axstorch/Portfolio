import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Section, Container } from './Section';
import { RESUME_DATA } from '../constants';
import { NAV_HEIGHT } from './Navbar';

const Hero: React.FC = () => {
  return (
    <Section
      id="about"
      tone="light"
      aria-label="Introduction"
      className="min-h-screen flex flex-col justify-between"
      style={{ paddingTop: NAV_HEIGHT + 48 }}
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-7">
            {/* Stays at 7xl: "Product Strategy" is ~630px wide at that size and
                the 7-column track is only ~655px at a 1280px viewport, so a
                larger xl step would push the line break. */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl leading-[0.92] font-medium mb-6">
              Product <span className="italic font-light">Strategy</span>
              <br />&amp; Execution
            </h1>
          </div>

          {/*
            Desktop only. The resume CTA lives in the nav, so the page carries
            exactly one of each. Bottom-aligned to the headline and flush to the
            right edge of the container.
          */}
          <div className="hidden lg:col-span-5 lg:flex lg:flex-col lg:justify-end lg:items-end lg:text-right gap-5">
            <a
              href="#work"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1C1C1C] text-[#F4F4F0] rounded-full text-xs uppercase tracking-widest hover:bg-[#333] transition-colors"
            >
              View work <ArrowUpRight size={14} />
            </a>

            <p className="max-w-[40ch] text-sm text-[#666] leading-[1.6] border-t border-[#1C1C1C]/10 pt-4">
              {RESUME_DATA.tagline}
            </p>
          </div>
        </div>

        {/* Mobile: the same single CTA, stacked under the subline. */}
        <div className="lg:hidden mt-8">
          <a
            href="#work"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#1C1C1C] text-[#F4F4F0] rounded-full text-xs uppercase tracking-widest"
          >
            View work <ArrowUpRight size={12} />
          </a>
        </div>
      </Container>

      <Container className="mt-12">
      <div className="w-full h-[34vh] md:h-[50vh] relative rounded-2xl overflow-hidden bg-stone-300">
        <img
          src="/assets/Perfect_banner-1024w.webp"
          srcSet="
            /assets/Perfect_banner-640w.webp   640w,
            /assets/Perfect_banner-1024w.webp 1024w,
            /assets/Perfect_banner-1600w.webp 1600w,
            /assets/Perfect_banner-2560w.webp 2560w
          "
          sizes="(max-width: 768px) 100vw, (max-width: 1664px) 100vw, 1472px"
          alt="Akshat Saxena at a product pitch event"
          width={1024}
          height={390}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      </Container>

      <Container className="mt-8">
        <div className="flex flex-wrap justify-between items-end gap-6 border-t border-[#1C1C1C]/10 pt-4">
          <div>
            <span className="block text-xs uppercase tracking-widest text-[#666]">Location</span>
            <span className="text-sm">{RESUME_DATA.location}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-widest text-[#666] text-right">Status</span>
            <span className="text-sm flex items-center justify-end gap-2">
              <span className="w-2 h-2 bg-green-600 rounded-full" aria-hidden="true"></span>
              Open for Roles
            </span>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Hero;
