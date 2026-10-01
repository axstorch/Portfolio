import React from 'react';
import { Section, Eyebrow } from './Section';
import { PROOF_STATS } from '../constants';

const ProofStrip: React.FC = () => {
  return (
    <Section id="proof" tone="cream" aria-label="Key results" className="py-16 md:py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <Eyebrow>Proof</Eyebrow>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1C1C1C]/10 rounded-2xl overflow-hidden border border-[#1C1C1C]/10">
          {PROOF_STATS.map((stat) => (
            <div key={stat.id} className="bg-[#FBF8F4] p-7 md:p-8">
              <div className="font-serif text-4xl md:text-5xl text-[#8B5E3C] leading-none mb-4">
                {stat.value}
              </div>
              <p className="text-base md:text-sm text-[#444] leading-[1.6] mb-5 max-w-[46ch]">{stat.context}</p>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#7A6A5C]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default ProofStrip;
