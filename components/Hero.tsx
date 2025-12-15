import React from 'react';
// import PerfectBanner from '../public/assets/Perfect_banner.jpg';

const Hero: React.FC = () => {
  return (
    <section id="about" className="relative min-h-screen pt-24 pb-12 px-6 md:px-12 flex flex-col justify-between">

      {/* Top Text */}
      <div className="w-full max-w-4xl z-10">
        <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[0.9] font-medium text-[#1C1C1C] mb-8">
          Product <br />
          <span className="italic font-light">Strategy</span> & <br />
          Execution
        </h1>
        <div className="flex flex-col md:flex-row gap-8 md:items-end">
          <p className="text-sm md:text-base text-[#666666] max-w-sm leading-relaxed uppercase tracking-wide">
            Identifying real user problems, shipping solutions, and improving adoption through execution.
          </p>
        </div>
      </div>

      {/* Main Image Placeholder */}
      <div className="mt-12 w-full h-[50vh] md:h-[65vh] relative rounded-2xl overflow-hidden group">
        <img
          src="/assets/Perfect_banner.jpg" // <-- use imported value
          alt="Profile banner"
          className="absolute inset-0 w-full h-full object-cover z-10" // <-- bring image forward
        />

        <div className="absolute inset-0 bg-stone-300/30 z-0 flex items-center justify-center text-stone-400 pointer-events-none">
          <span className="uppercase tracking-widest text-sm">[Profile Image Placeholder]</span>
        </div>
      </div>


      {/* Bottom Info */}
      <div className="mt-8 flex justify-between items-end border-t border-[#1C1C1C]/10 pt-4">
        <div className="hidden md:block">
          <span className="block text-xs uppercase tracking-widest text-[#666666]">Location</span>
          <span className="text-sm">Bhubaneswar, IN</span>
        </div>
        <div>
          <span className="block text-xs uppercase tracking-widest text-[#666666] text-right">Status</span>
          <span className="text-sm flex items-center justify-end gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Open for Roles
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
