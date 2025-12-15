import React from 'react';
import { EXPERIENCE_DATA } from '../constants';

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl mb-12 text-center font-serif italic">Experience Record</h2>

        <div className="space-y-12">
          {EXPERIENCE_DATA.map((exp) => (
            <div key={exp.id} className="border-t border-[#1C1C1C]/10 pt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <span className="text-sm text-[#666666] uppercase tracking-wide block mb-1">{exp.period}</span>
                <span className="text-xs text-[#999]">{exp.location}</span>
              </div>
              
              <div className="md:col-span-3">
                <h3 className="text-xl font-medium mb-1">{exp.role}</h3>
                <p className="text-lg font-serif italic text-[#666666] mb-4">{exp.company}</p>
                
                <ul className="space-y-2">
                  {exp.description.map((item, idx) => (
                    <li key={idx} className="text-[#444] text-sm leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:bg-[#1C1C1C] before:rounded-full">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
