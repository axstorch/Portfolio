import React from 'react';
import { Section, Eyebrow } from './Section';
import { BTS_IMAGES } from '../constants';

const BTS: React.FC = () => {
  return (
    <Section id="bts" tone="stone" aria-label="Behind the scenes" className="py-16 md:py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Eyebrow>Off the record</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-serif italic">Behind the Scenes</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {BTS_IMAGES.map((img) => (
            <figure
              key={img.id}
              className="relative rounded-lg overflow-hidden bg-stone-300 aspect-[4/5] group"
            >
              <img
                src={img.image}
                alt={img.alt}
                width={1200}
                height={1600}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <figcaption className="text-white text-xs">{img.caption}</figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default BTS;
