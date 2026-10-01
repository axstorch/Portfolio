import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Section, Eyebrow } from './Section';
import { LINKEDIN_POSTS, RESUME_DATA } from '../constants';
import type { LinkedInPost } from '../types';

const PostCard: React.FC<{ post: LinkedInPost }> = ({ post }) => {
  return (
    <article className="bg-[#FBF8F4] rounded-xl border border-[#1C1C1C]/10 overflow-hidden flex flex-col h-full select-none">
      {post.image && (
        <div className="h-44 shrink-0 overflow-hidden bg-[#F1EEE9]">
          <img
            src={post.image}
            alt=""
            aria-hidden="true"
            draggable={false}
            loading="lazy"
            decoding="async"
            width={538}
            height={709}
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>
      )}

      <div className="p-5 flex flex-col justify-between h-full min-h-[220px]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#8B5E3C]">{post.date}</span>
          <h3 className="text-lg font-serif mt-2 mb-2 leading-snug text-[#1C1C1C]">
            {post.title}
          </h3>
          <p className="text-base md:text-sm text-[#555] leading-[1.6] line-clamp-3">{post.excerpt}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-[#1C1C1C]/10 flex items-center justify-between text-xs text-[#7A6A5C]">
          <span>
            {post.likes} likes, {post.comments} comments
          </span>
          <a
            href={post.url}
            target="_blank"
            rel="noreferrer"
            className="uppercase tracking-widest text-[#8B5E3C] hover:opacity-70 transition-opacity flex items-center gap-1 select-text cursor-pointer"
          >
            Read on LinkedIn <Linkedin size={12} />
          </a>
        </div>
      </div>
    </article>
  );
};

const LatestThinking: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const touchX = useRef<number | null>(null);
  const count = LINKEDIN_POSTS.length;

  const next = useCallback(() => setCurrent((p) => (p + 1) % count), [count]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + count) % count), [count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  /* Swipe on touch devices. */
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(delta) > 45) (delta < 0 ? next : prev)();
    touchX.current = null;
  };

  return (
    <Section id="posts" tone="light" aria-label="Latest thinking" className="py-20 md:py-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <Eyebrow>Writing</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-serif">Latest Thinking</h2>
          </div>
          <a
            href={RESUME_DATA.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8B5E3C] hover:opacity-70 transition-opacity"
          >
            View all posts <ArrowRight size={13} />
          </a>
        </div>

        {/* Arrows sit inside the container, 16px from each edge. */}
        <div className="relative px-0 sm:px-12">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous post"
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full border border-[#1C1C1C]/15 bg-[#F4F4F0] hover:border-[#1C1C1C]/40 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="min-h-[340px]"
          >
            <PostCard post={LINKEDIN_POSTS[current]} />
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next post"
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full border border-[#1C1C1C]/15 bg-[#F4F4F0] hover:border-[#1C1C1C]/40 transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          {/* Mobile controls */}
          <div className="sm:hidden flex justify-center gap-3 mt-5">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous post"
              className="w-11 h-11 flex items-center justify-center rounded-full border border-[#1C1C1C]/15"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next post"
              className="w-11 h-11 flex items-center justify-center rounded-full border border-[#1C1C1C]/15"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Dot controls. The visual dot is 8px, but the button carries a
            24px hit area and 8px of spacing so it clears 44px-touch spacing
            rules without looking oversized. */}
        <div className="flex justify-center items-center gap-2 mt-7">
          {LINKEDIN_POSTS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Go to post ${i + 1} of ${count}`}
              aria-current={i === current}
              className="w-6 h-6 flex items-center justify-center"
            >
              <span
                className={`block h-2 rounded-full transition-all ${
                  i === current
                    ? 'bg-[#8B5E3C] w-6'
                    : 'bg-[#1C1C1C]/20 w-2 hover:bg-[#1C1C1C]/40'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default LatestThinking;
