import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div
      className="custom-cursor fixed pointer-events-none z-[9999] mix-blend-difference hidden md:flex items-center justify-center transition-transform duration-100 ease-out"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
      }}
    >
      <div className={`
        relative flex items-center justify-center rounded-full border border-white transition-all duration-300
        ${isHovering ? 'w-12 h-12 bg-white text-black' : 'w-8 h-8 bg-transparent'}
      `}>
        <div className={`w-1 h-1 bg-white rounded-full transition-opacity ${isHovering ? 'opacity-0' : 'opacity-100'}`} />
        {isHovering && (
           <span className="text-[8px] font-bold uppercase tracking-widest text-black">View</span>
        )}
      </div>
    </div>
  );
};

export default CustomCursor;
