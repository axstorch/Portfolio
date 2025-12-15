import React, { useRef, useState } from 'react';
import { ArrowRight, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react';
import { LINKEDIN_POSTS, RESUME_DATA } from '../constants';


type LinkedInPostCardProps = {
  post: {
    date: string;
    title: string;
    excerpt: string;
    likes: number;
    comments: number;
    url: string;
    image: string;
  };
};
const LinkedInPostCard: React.FC<LinkedInPostCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-xl border border-[#1C1C1C]/10 overflow-hidden flex flex-col">

      {/* Image */}
      {post.image && (
        <div className="w-200 h-80 overflow-hidden bg-[#F5F5F5]">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col justify-between h-full">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#999999]">
            {post.date}
          </span>

          <h3 className="text-xl font-serif mt-3 mb-3">
            {post.title}
          </h3>

          <p className="text-sm text-[#666666] leading-relaxed line-clamp-4">
            {post.excerpt}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-[#777777]">
          <span>
            👍 {post.likes} · 💬 {post.comments}
          </span>

          <a
            href={post.url}
            target="_blank"
            rel="noreferrer"
            className="uppercase tracking-widest hover:underline flex items-center gap-1"
          >
            Read on LinkedIn <Linkedin size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};


const LinkedInSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % LINKEDIN_POSTS.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + LINKEDIN_POSTS.length) % LINKEDIN_POSTS.length);
  };

  return (
    <section id="linkedin" className="py-24 border-t border-[#1C1C1C]/5">

      {/* Header */}
      <div className="px-6 md:px-12 mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-4xl md:text-5xl mb-4">Latest Thinking</h2>
          <p className="text-[#666666] max-w-md">Embeddable posts from my Linkedin.</p>
        </div>
        <a
          href={RESUME_DATA.linkedin}
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex relative z-50 items-center gap-2 uppercase text-xs tracking-widest hover:underline"
        >
          View all posts <ArrowRight size={14} />
        </a>
      </div>


      {/* Carousel Container */}
      <div className="relative px-6 md:px-12 flex items-center justify-center">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute left-0 md:left-0 z-20 p-2 rounded-full bg-[#1C1C1C] text-white hover:bg-[#333333] transition-colors"
          aria-label="Previous post"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Main Carousel */}
        <div className="w-full max-w-2xl">
          <div className="relative overflow-hidden rounded-xl">
            <LinkedInPostCard post={LINKEDIN_POSTS[currentSlide]} />
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {LINKEDIN_POSTS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                  ? 'bg-[#1C1C1C] w-8'
                  : 'bg-[#CCCCCC] hover:bg-[#999999]'
                  }`}
                aria-label={`Go to post ${index + 1}`}
              />
            ))}
          </div>
        </div>


        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-0 md:right-0 z-20 p-2 rounded-full bg-[#1C1C1C] text-white hover:bg-[#333333] transition-colors"
          aria-label="Next post"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* View All CTA - Mobile */}
      <div className="mt-8 md:hidden flex justify-center">
        <a
          href={RESUME_DATA.linkedin}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 uppercase text-xs tracking-widest hover:underline"
        >
          View all posts <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
};

export default LinkedInSection;