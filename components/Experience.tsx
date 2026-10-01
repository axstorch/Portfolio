import React, { useState } from 'react';
import { Section, Eyebrow, Container } from './Section';
import { EXPERIENCE_DATA, EDUCATION_DATA, shortMonths } from '../constants';
import type { ExperienceItem } from '../types';

/** Wraps the bolded label at the start of a bullet. */
const Bullet: React.FC<{ text: string; label?: string }> = ({ text, label }) => {
  if (!label || !text.startsWith(label)) return <>{text}</>;
  return (
    <>
      <span className="font-medium text-[#1C1C1C]">{label}</span>
      {text.slice(label.length)}
    </>
  );
};

const CompanyLogo: React.FC<{ company: string; src?: string }> = ({ company, src }) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return (
    <img
      src={src}
      alt={`${company} logo`}
      onError={() => setFailed(true)}
      className="h-6 w-auto max-w-[96px] object-contain shrink-0"
      loading="lazy"
    />
  );
};

const Role: React.FC<{ exp: ExperienceItem }> = ({ exp }) => {
  const [open, setOpen] = useState(!exp.collapsed);
  const visible = open ? exp.description : exp.description.slice(0, 2);

  return (
    <div className="border-t border-[#1C1C1C]/10 pt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <span className="text-sm text-[#666] uppercase tracking-wide block mb-1">
          {shortMonths(exp.period)}
        </span>
        <span className="text-xs text-[#7A6A5C]">{exp.location}</span>
      </div>

      <div className="md:col-span-3">
        <h3 className="text-xl font-medium">{exp.role}</h3>
        <div className="flex items-center gap-3 mt-1 mb-4">
          <CompanyLogo company={exp.company} src={exp.logo} />
          <p className="text-lg font-serif italic text-[#8B5E3C]">{exp.company}</p>
        </div>

        <ul className="space-y-2.5">
          {visible.map((item, i) => (
            <li
              key={i}
              className="text-[#333] text-base md:text-sm leading-[1.6] pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:bg-[#8B5E3C] before:rounded-full"
            >
              <Bullet text={item} label={exp.label} />
            </li>
          ))}
        </ul>

        {exp.description.length > 2 && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="mt-4 text-xs uppercase tracking-widest text-[#8B5E3C] hover:opacity-70 transition-opacity"
          >
            {open ? 'Show less' : `Show ${exp.description.length - 2} more`}
          </button>
        )}
      </div>
    </div>
  );
};

const Experience: React.FC = () => {
  return (
    <Section id="experience" tone="white" aria-label="Experience" className="py-20 md:py-28">
      <Container>
        <div className="text-center mb-14">
          <div className="flex justify-center">
            <Eyebrow>Experience</Eyebrow>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif italic">Experience Record</h2>
        </div>

        <div className="space-y-12">
          {EXPERIENCE_DATA.map((exp) => (
            <Role key={exp.id} exp={exp} />
          ))}
        </div>

        <div className="border-t border-[#1C1C1C]/10 mt-12 pt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <span className="text-sm text-[#666] uppercase tracking-wide block mb-1">
              {shortMonths(EDUCATION_DATA.period)}
            </span>
            <span className="text-xs text-[#7A6A5C]">{EDUCATION_DATA.location}</span>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-xl font-medium">{EDUCATION_DATA.degree}</h3>
            <p className="text-lg font-serif italic text-[#8B5E3C] mt-1">
              {EDUCATION_DATA.school}
            </p>
            <p className="text-sm text-[#333] mt-2">CGPA {EDUCATION_DATA.cgpa}</p>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Experience;
