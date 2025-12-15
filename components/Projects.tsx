import React from 'react';
import { PROJECTS_DATA } from '../constants';

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-24 px-6 md:px-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-[#1C1C1C]/10 pb-8">
        <h2 className="text-4xl md:text-6xl">Selected <br /> Works</h2>
        <span className="text-sm uppercase tracking-widest text-[#666666] mb-2">(0{PROJECTS_DATA.length})</span>
      </div>

      <div className="space-y-24">
        {PROJECTS_DATA.map((project, index) => (
          <div key={project.id} className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Image Side */}
            <div
              className={`
    lg:col-span-8 relative aspect-[16/10] rounded-xl overflow-hidden
    ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}
  `}
            >
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-contain bg-[#F4F4F0]"
                  loading="lazy"
                />
              ) : (
                <div
                  className={`absolute inset-0 ${project.imagePlaceholder} flex items-center justify-center text-stone-500`}
                >
                  <span className="uppercase tracking-widest">
                    [Project Image Placeholder]
                  </span>
                </div>
              )}
            </div>


            {/* Content Side */}
            <div className={`
              lg:col-span-4 flex flex-col justify-center h-full space-y-6
              ${index % 2 === 1 ? 'lg:order-1 lg:text-right items-end' : 'lg:order-2 lg:text-left items-start'}
            `}>
              <div>
                <span className="text-xs uppercase tracking-widest text-[#666666] mb-2 block">0{index + 1}</span>
                <h3 className="text-3xl md:text-4xl font-serif">{project.title}</h3>
              </div>

              <p className="text-[#666666] leading-relaxed max-w-sm">
                {project.description}
              </p>

              <div className={`flex flex-wrap gap-2 ${index % 2 === 1 ? 'justify-end' : 'justify-start'}`}>
                {project.technologies.map((tech) => (
                  <span key={tech} className="px-3 py-1 border border-[#1C1C1C]/10 rounded-full text-xs uppercase tracking-wider">
                    {tech}
                  </span>
                ))}
              </div>

              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm border-b border-[#1C1C1C] pb-1 hover:pb-2 transition-all uppercase tracking-widest">
                Try them out!
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
