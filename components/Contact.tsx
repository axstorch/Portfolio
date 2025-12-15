import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { RESUME_DATA } from '../constants';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 px-6 md:px-12 bg-[#F4F4F0]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-7xl font-serif mb-8">Don't shy away from connecting!</h2>

        <a
          href={`mailto:${RESUME_DATA.email}`}
          className="inline-block text-xl md:text-2xl border-b border-[#1C1C1C] pb-1 hover:opacity-70 transition-opacity mb-12"
        >
          {RESUME_DATA.email}
        </a>

        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <a href={RESUME_DATA.linkedin} target="_blank" className="uppercase tracking-widest text-xs font-bold flex items-center gap-1 hover:opacity-60">
            LinkedIn <ArrowUpRight size={12} />
          </a>
          <a href={RESUME_DATA.Github} target="_blank" className="uppercase tracking-widest text-xs font-bold flex items-center gap-1 hover:opacity-60">
            GitHub <ArrowUpRight size={12} />
          </a>
          <a href={RESUME_DATA.Resune} target="_blank" className="uppercase tracking-widest text-xs font-bold flex items-center gap-1 hover:opacity-60">
            Resume <ArrowUpRight size={12} />
          </a>
        </div>

        <div className="mt-24 text-[10px] uppercase tracking-widest text-[#666666]">
          © {new Date().getFullYear()} Akshat Saxena. All Rights Reserved.
        </div>
      </div>
    </section>
  );
};

export default Contact;
