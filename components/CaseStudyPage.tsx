import React, { useEffect } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Eyebrow, Container } from './Section';
import { CASE_STUDY_PAGES, RESUME_DATA, TRAYA_ROADMAP, TRAYA_EXPECTED_IMPACT, TRAYA_LEARNINGS, TRAYA_INSIGHTS } from '../constants';
import { Link, navigate } from '../router';
import { TrayaFunnel, ImpactEffortMatrix } from './trayaVisuals';
import type { Deliverable } from '../types';

const DeliverableSlot: React.FC<{ d: Deliverable }> = ({ d }) => {
  if (d.src) {
    return (
      <figure>
        <a
          href={d.src}
          target="_blank"
          rel="noreferrer"
          className="block rounded-xl border border-[#1C1C1C]/10 overflow-hidden hover:opacity-90 transition-opacity"
        >
          <img
            src={d.src}
            alt={d.alt}
            loading="lazy"
            decoding="async"
            className="w-full"
          />
        </a>
        <figcaption className="text-xs text-[#6B5D50] mt-2">{d.caption}</figcaption>
      </figure>
    );
  }

  /* The Traya visuals are rendered live from the deck data, not slotted. */
  if (d.slotLabel === 'traya:funnel') {
    return (
      <figure>
        <TrayaFunnel />
        <figcaption className="text-xs text-[#6B5D50] mt-2">{d.caption}</figcaption>
      </figure>
    );
  }
  if (d.slotLabel === 'traya:matrix') {
    return (
      <figure>
        <ImpactEffortMatrix />
        <figcaption className="text-xs text-[#6B5D50] mt-2">{d.caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure>
      <div
        role="img"
        aria-label={`${d.alt}. Image pending: ${d.slotLabel}`}
        className="aspect-[4/3] rounded-xl border border-dashed border-[#8B5E3C]/45 bg-[#FBF8F4] flex flex-col items-center justify-center gap-3 text-center px-6"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#8B5E3C]">{d.slotLabel}</span>
        <span className="text-xs text-[#6B5D50] max-w-[30ch] leading-[1.6]">{d.alt}</span>
      </div>
      <figcaption className="text-xs text-[#6B5D50] mt-2">{d.caption}</figcaption>
    </figure>
  );
};

const CaseStudyPage: React.FC<{ slug: string }> = ({ slug }) => {
  const index = CASE_STUDY_PAGES.findIndex((c) => c.slug === slug);
  const study = CASE_STUDY_PAGES[index];

  const prev = index > 0 ? CASE_STUDY_PAGES[index - 1] : null;
  const next =
    index >= 0 && index < CASE_STUDY_PAGES.length - 1 ? CASE_STUDY_PAGES[index + 1] : null;

  useEffect(() => {
    if (study) document.title = `${study.title} | Akshat Saxena`;
    return () => {
      document.title = 'Akshat Saxena | Product Manager (APM)';
    };
  }, [study]);

  if (!study) return null;

  return (
    <main id="main" className="bg-[#F4F4F0] text-[#1C1C1C]">
      <Container className="pt-32 md:pt-40 pb-24">
        {/* Header */}
        <Eyebrow>{study.type}</Eyebrow>

        <h1 className="text-4xl md:text-6xl leading-[0.95] font-serif mb-4">{study.title}</h1>
        <p className="text-lg md:text-lg text-[#555] max-w-[60ch] leading-[1.6] mb-8">{study.summary}</p>

        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-[#1C1C1C]/10 mb-14">
          <div>
            <dt className="text-[10px] uppercase tracking-[0.18em] text-[#7A6A5C] mb-1">Role</dt>
            <dd className="text-base md:text-sm">{study.role}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.18em] text-[#7A6A5C] mb-1">Type</dt>
            <dd className="text-base md:text-sm">{study.type}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.18em] text-[#7A6A5C] mb-1">Date</dt>
            <dd className="text-base md:text-sm">{study.date || '—'}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.18em] text-[#7A6A5C] mb-1">Company</dt>
            <dd className="text-base md:text-sm">{study.title}</dd>
          </div>
        </dl>

        {/* Narrative sections */}
        <div className="space-y-10 max-w-[62ch]">
          {study.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-2xl md:text-3xl font-serif mb-3">{s.heading}</h2>
              <p className="text-base md:text-[15px] text-[#333] leading-[1.7]">{s.body}</p>
            </section>
          ))}
        </div>

        {/* Traya specifics, straight from the deck */}
        {study.slug === 'traya' && (
          <div className="mt-14 space-y-10">
            <section>
              <h2 className="text-2xl md:text-3xl font-serif mb-5">The 8 enhancements</h2>
              <div className="space-y-4">
                {TRAYA_INSIGHTS.map((it) => (
                  <details
                    key={it.n}
                    className="group border border-[#1C1C1C]/10 rounded-xl bg-[#FBF8F4] overflow-hidden"
                  >
                    <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4 hover:bg-[#F4EFE8] transition-colors">
                      <span className="flex items-baseline gap-3">
                        <span className="text-xs uppercase tracking-widest text-[#8B5E3C]">
                          {String(it.n).padStart(2, '0')}
                        </span>
                        <span className="font-serif text-lg">{it.title}</span>
                      </span>
                      <span className="flex items-center gap-3 shrink-0">
                        <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-[#6B5D50]">
                          {it.effort} effort / {it.impact} impact
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#1C1C1C]/8 text-[10px] uppercase tracking-wider text-[#333]">
                          {it.priority}
                        </span>
                      </span>
                    </summary>
                    <div className="px-5 pb-5 pt-0 text-base md:text-sm space-y-3">
                      <p className="text-[#444] leading-[1.6]">
                        <span className="uppercase tracking-wider text-[10px] text-[#8B5E3C] mr-2">
                          Problem
                        </span>
                        {it.problem}
                      </p>
                      <div>
                        <span className="uppercase tracking-wider text-[10px] text-[#8B5E3C]">
                          Solution
                        </span>
                        <ul className="mt-2 space-y-1">
                          {it.solution.map((s) => (
                            <li key={s} className="text-base md:text-sm text-[#333] leading-[1.6] pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1 before:h-1 before:bg-[#8B5E3C] before:rounded-full">
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-serif mb-5">3-month roadmap</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1C1C1C]/10 rounded-xl overflow-hidden border border-[#1C1C1C]/10">
                {TRAYA_ROADMAP.map((m) => (
                  <div key={m.month} className="bg-[#FBF8F4] p-5">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#8B5E3C] mb-1">
                      {m.month}
                    </div>
                    <div className="font-serif text-lg mb-3">{m.title}</div>
                    <ul className="space-y-1 text-base md:text-sm text-[#333]">
                      {m.items.map((i) => (
                        <li key={i} className="leading-[1.6] pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1 before:h-1 before:bg-[#8B5E3C] before:rounded-full">
                          {i}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-serif mb-5">Expected impact</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#1C1C1C]/10 rounded-xl overflow-hidden border border-[#1C1C1C]/10">
                {TRAYA_EXPECTED_IMPACT.map((e) => (
                  <div key={e.area} className="bg-[#FBF8F4] p-5">
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-[#7A6A5C] mb-1">
                      {e.area}
                    </dt>
                    <dd className="text-base md:text-sm">{e.change}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-serif mb-5">What I learned</h2>
              <ol className="space-y-4">
                {TRAYA_LEARNINGS.map((l) => (
                  <li key={l.n} className="flex gap-4">
                    <span className="text-xs uppercase tracking-widest text-[#8B5E3C] shrink-0 pt-1">
                      {l.n}
                    </span>
                    <div>
                      <div className="font-serif text-lg">{l.title}</div>
                      <p className="text-base md:text-sm text-[#444] leading-[1.6] mt-1">{l.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        )}

        {/* Deliverables */}
        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-serif mb-5">Deliverables</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {study.deliverables.map((d, i) => (
              <DeliverableSlot key={i} d={d} />
            ))}
          </div>

          {study.deckUrl ? (
            <a
              href={study.deckUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[#1C1C1C] text-[#F4F4F0] rounded-full text-xs uppercase tracking-widest hover:bg-[#333] transition-colors"
            >
              <FileText size={14} /> {study.deckLabel}
            </a>
          ) : (
            <p className="mt-8 text-base md:text-sm text-[#6B5D50]">
              Full {study.type.toLowerCase()} available on request.
            </p>
          )}
        </section>

        {/* Footer nav */}
        <div className="mt-20 pt-8 border-t border-[#1C1C1C]/10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            {prev ? (
              <Link
                to={`/work/${prev.slug}`}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest group"
              >
                <ChevronLeft size={14} />
                <span>
                  <span className="block text-[10px] text-[#7A6A5C]">Previous</span>
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}

            {next ? (
              <Link
                to={`/work/${next.slug}`}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest group"
              >
                <span>
                  <span className="block text-[10px] text-[#7A6A5C]">Next</span>
                  {next.title}
                </span>
                <ChevronRight size={14} />
              </Link>
            ) : (
              <span />
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="px-5 py-2.5 border border-[#1C1C1C]/20 rounded-full text-xs uppercase tracking-widest hover:border-[#1C1C1C] transition-colors"
            >
              All work
            </Link>
            <a
              href={RESUME_DATA.resume}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 border border-[#1C1C1C]/20 rounded-full text-xs uppercase tracking-widest hover:border-[#1C1C1C] transition-colors"
            >
              Resume
            </a>
            <a
              href={`mailto:${RESUME_DATA.email}`}
              className="inline-flex items-center gap-1 px-5 py-2.5 bg-[#1C1C1C] text-[#F4F4F0] rounded-full text-xs uppercase tracking-widest hover:bg-[#333] transition-colors"
            >
              Contact <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default CaseStudyPage;
