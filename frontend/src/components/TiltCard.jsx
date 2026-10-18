import React, { useRef } from 'react';

const isTouch =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(hover: none)').matches);

const isReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Card that leans toward pointer in 3D on desktop, and uses touch-friendly spring on mobile */
export default function TiltCard({ children, className = '', style, onClick }) {
  const ref = useRef(null);

  const handlePointerMove = (e) => {
    if (isTouch || isReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    ref.current.style.transition = 'transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)';
    ref.current.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(6px)`;
  };

  const handlePointerLeave = () => {
    if (!ref.current) return;
    ref.current.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    ref.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
  };

  return (
    <div
      style={{ perspective: 1000, ...style }}
      className="reveal will-change-transform"
      onClick={onClick}
    >
      <div
        ref={ref}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`${className} transition-all duration-300`}
      >
        {children}
      </div>
    </div>
  );
}
