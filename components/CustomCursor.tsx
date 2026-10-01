import React, { useEffect, useState } from 'react';

/**
 * Custom circular cursor. Disabled entirely when the user prefers reduced
 * motion, on touch devices, and on any element marked data-native-cursor,
 * so the system cursor is never hidden where it is needed.
 */
const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(hover: none), (pointer: coarse)');

    const evaluate = () => {
      setEnabled(!reduce.matches && !coarse.matches);
    };
    evaluate();
    reduce.addEventListener('change', evaluate);
    coarse.addEventListener('change', evaluate);
    return () => {
      reduce.removeEventListener('change', evaluate);
      coarse.removeEventListener('change', evaluate);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);

      const el = e.target as HTMLElement | null;
      const interactive = el?.closest(
        'a, button, input, textarea, select, [role="button"], [data-native-cursor]'
      );
      const isInteractive = Boolean(interactive) && !el?.closest('[data-native-cursor]');
      setHovering(isInteractive);
    };
    const leave = () => setVisible(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseleave', leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="custom-cursor fixed pointer-events-none z-[9999] hidden md:flex items-center justify-center transition-transform duration-100 ease-out mix-blend-difference"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: `translate(-50%, -50%) scale(${hovering ? 1.4 : 1})`,
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className={`flex items-center justify-center rounded-full border border-white transition-all duration-300 ${
          hovering ? 'w-11 h-11 bg-white' : 'w-8 h-8 bg-transparent'
        }`}
      >
        {!hovering && <span className="w-1 h-1 bg-white rounded-full" />}
      </div>
    </div>
  );
};

export default CustomCursor;
