import React from 'react';
import { SKILLS_DATA } from '../constants';

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-24 px-6 md:px-12 bg-[#1C1C1C] text-[#F4F4F0]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl md:text-6xl mb-8 font-serif">Expertise & <br /> Capabilities</h2>
          <p className="text-white/60 max-w-sm leading-relaxed">
            A synthesis of technical engineering and strategic product thinking.
            Always learning, always refining.
          </p>
        </div>

        <div className="space-y-12">



          {SKILLS_DATA.map((category) => (
            <div key={category.category}>
              <h3 className="text-sm uppercase tracking-[0.2em] text-white/40 mb-6 border-b border-white/10 pb-2">{category.category}</h3>
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {category.skills.map((skill) => (
                  <span key={skill} className="text-xl md:text-2xl font-serif hover:text-white/80 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
