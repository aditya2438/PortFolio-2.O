import React, { useRef } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  hoverLift?: boolean;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  hoverLift = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const el = cardRef.current;
      const glow = glowRef.current;
      if (!el || !glow) return;
      const rect = el.getBoundingClientRect();
      glow.style.setProperty('--mx', `${clientX - rect.left}px`);
      glow.style.setProperty('--my', `${clientY - rect.top}px`);
      glow.style.opacity = '1';
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`glass-surface relative overflow-hidden rounded-2xl transition-transform transition-colors duration-200 ease-out ${
        hoverLift ? 'hover:-translate-y-1 hover:border-[#ff9f1c]/40' : ''
      } ${className}`}
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: 0,
          background:
            'radial-gradient(460px circle at var(--mx, -400px) var(--my, -400px), rgba(255, 159, 28, 0.13), rgba(46, 196, 182, 0.05) 40%, transparent 70%)',
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};
