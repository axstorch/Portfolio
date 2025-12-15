import React from 'react';
import { BTS_IMAGES } from '../constants';

const BTSSection: React.FC = () => {
  return (
    <section id="bts" className="py-24 px-6 md:px-12 bg-[#EBEAE5]">
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl mb-4 italic">Behind the Scenes</h2>
        <p className="text-[#666666]">Just what an HR wats to see</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-3 auto-rows-[350px]">
        {BTS_IMAGES.map((img, idx) => (
          <div
            key={img.id}
            className={`
              relative rounded-lg overflow-hidden group bg-stone-300
              ${img.aspectRatio === 'portrait' ? 'row-span-2' : 'row-span-1'}
              ${img.aspectRatio === 'landscape' ? 'col-span-1 md:col-span-2' : 'col-span-1'}
            `}
          >
            {/* Placeholder for Image */}
            <img
              src={img.image}
              alt={img.caption}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />


            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <p className="text-white text-sm font-medium">{img.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BTSSection;
