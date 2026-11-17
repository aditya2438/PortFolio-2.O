import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { triggerConfettiBurst } from '../utils/confetti';

interface PreloaderProps {
  onComplete: () => void;
}

const GREETING_FRAMES = [
  { word: 'Namaste.', fontClass: 'font-editorial text-gradient-aurora', tag: 'INDORE · INDIA' },
  { word: 'Architecting.', fontClass: 'font-avant text-[#f8fafc]', tag: 'JAVA 21 · SPRING 3.3' },
  { word: 'Scaling.', fontClass: 'font-mono text-[#22d3ee]', tag: 'KAFKA · REDIS <25MS' },
];

const PILLARS = [
  { label: 'JAVA', color: '#f89820', delay: 0 },
  { label: 'SPRING', color: '#6db33f', delay: 0.08 },
  { label: 'KAFKA', color: '#38bdf8', delay: 0.16 },
  { label: 'REDIS', color: '#ff4438', delay: 0.24 },
  { label: 'DOCKER', color: '#c084fc', delay: 0.32 },
];

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [frameIdx, setFrameIdx] = useState(0);
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const launchLouverReveal = (celebrate = false) => {
    if (doneRef.current) return;
    doneRef.current = true;
    if (celebrate) {
      triggerConfettiBurst(0.5, 0.5);
    }
    setExiting(true);
    window.setTimeout(onComplete, 660);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (params.get('autostart') === '1' || reduced) {
      onComplete();
      return;
    }

    const t1 = window.setTimeout(() => setFrameIdx(1), 520);
    const t2 = window.setTimeout(() => setFrameIdx(2), 1040);
    const autoDone = window.setTimeout(() => launchLouverReveal(false), 1850);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        launchLouverReveal(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(autoDone);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onComplete]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el || exiting) return;
    const tx = (e.clientX / window.innerWidth - 0.5) * 18;
    const ty = (e.clientY / window.innerHeight - 0.5) * 12;
    el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0)`;
  };

  const currentFrame = GREETING_FRAMES[frameIdx] || GREETING_FRAMES[0];

  return (
    <div
      role="dialog"
      aria-label="Kinetic 5-Column Louver Preloader"
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between overflow-hidden p-6 sm:p-10 select-none"
    >
      {/* 5 Staggered Architectural Obsidian Louver Columns */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid grid-cols-5">
        {PILLARS.map((col, idx) => (
          <motion.div
            key={col.label}
            initial={{ y: '0%' }}
            animate={{ y: exiting ? '-106%' : '0%' }}
            transition={{
              duration: 0.52,
              delay: exiting ? idx * 0.055 : 0,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="relative h-full border-r border-white/[0.06] bg-[#06091f] last:border-r-0"
            style={{
              backgroundImage:
                idx % 2 === 0
                  ? 'linear-gradient(180deg, rgba(34,211,238,0.09) 0%, rgba(6,9,31,0.98) 52%, rgba(192,132,252,0.08) 100%)'
                  : 'linear-gradient(180deg, rgba(192,132,252,0.08) 0%, rgba(8,12,38,0.98) 50%, rgba(255,159,28,0.07) 100%)',
            }}
          >
            {/* Subtle luminous bottom louver seam */}
            <span
              className="absolute inset-x-0 bottom-0 h-0.5 opacity-60"
              style={{ backgroundColor: col.color }}
            />
          </motion.div>
        ))}
      </div>

      {/* Top Studio Header Strip */}
      <motion.div
        animate={{ opacity: exiting ? 0 : 1, y: exiting ? -14 : 0 }}
        transition={{ duration: 0.22 }}
        className="relative z-20 flex w-full items-center justify-between font-mono text-[11px] tracking-widest text-slate-400"
      >
        <span className="inline-flex items-center gap-2 text-[#22d3ee]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{currentFrame.tag}</span>
        </span>
        <button
          type="button"
          onClick={() => launchLouverReveal(false)}
          aria-label="Skip intro preloader"
          className="rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[11px] font-medium text-slate-200 transition-colors hover:border-[#22d3ee]/60 hover:text-[#22d3ee] cursor-pointer"
        >
          Skip Intro →
        </button>
      </motion.div>

      {/* Center Multi-Font Signature & Equalizer Stage */}
      <motion.div
        ref={stageRef}
        animate={{ opacity: exiting ? 0 : 1, scale: exiting ? 0.94 : 1 }}
        transition={{ duration: 0.25 }}
        style={{ transition: 'transform 0.22s ease-out' }}
        className="relative z-20 flex flex-col items-center text-center"
      >
        {/* Calligraphic Self-Drawing Signature Stroke SVG */}
        <svg viewBox="0 0 220 54" className="h-11 w-44 sm:h-12 sm:w-48" aria-hidden="true">
          <defs>
            <linearGradient id="sigGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#ff9f1c" />
            </linearGradient>
          </defs>
          <motion.path
            d="M18 42 C28 12, 42 10, 48 40 M25 30 L45 27 M58 34 C66 18, 82 20, 74 36 C92 16, 108 18, 104 34 C118 22, 134 24, 132 34 C144 26, 166 20, 200 24"
            fill="none"
            stroke="url(#sigGrad)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.circle
            cx="202"
            cy="24"
            r="3"
            fill="#ff9f1c"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.85, duration: 0.25 }}
          />
        </svg>

        {/* Rotating Multi-Font Kinetic Greeting */}
        <div className="relative mt-2 flex h-16 items-center justify-center overflow-hidden px-4 sm:h-20">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h1
              key={frameIdx}
              initial={{ y: '90%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-90%', opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`text-[clamp(2.3rem,6.5vw,4.7rem)] font-bold leading-none ${currentFrame.fontClass}`}
            >
              {currentFrame.word}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Brand Identity + Interactive Equalizer Pillars */}
        <p className="mt-2 font-display text-sm font-semibold tracking-[0.22em] text-slate-300 uppercase sm:text-base">
          Aditya Singh Chouhan
        </p>

        <div className="mt-5 flex items-end justify-center gap-2">
          {PILLARS.map((bar, i) => (
            <div key={bar.label} className="flex flex-col items-center gap-1.5">
              <motion.span
                initial={{ height: 8 }}
                animate={{ height: [10, 28, 14, 24] }}
                transition={{
                  duration: 1.2,
                  delay: bar.delay,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                }}
                className="w-1.5 rounded-full"
                style={{
                  backgroundColor: bar.color,
                  boxShadow: `0 0 12px ${bar.color}88`,
                }}
              />
              <span className="font-mono text-[9px] text-slate-500">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>

        {/* Interactive Enter Button */}
        <motion.button
          type="button"
          onClick={() => launchLouverReveal(true)}
          aria-label="Enter Aditya Chouhan portfolio studio"
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="group mt-6 inline-flex items-center gap-2.5 rounded-xl border border-[#22d3ee]/45 bg-[#0b1230]/90 px-5 py-2.5 font-mono text-xs font-semibold tracking-[0.15em] text-[#f8fafc] uppercase shadow-[0_0_32px_rgba(34,211,238,0.22)] transition-colors hover:border-[#22d3ee] hover:text-[#22d3ee] cursor-pointer"
        >
          <span>Enter Portfolio</span>
          <ArrowRight className="h-3.5 w-3.5 text-[#22d3ee] transition-transform duration-200 group-hover:translate-x-1" />
        </motion.button>
      </motion.div>

      {/* Bottom Footer Signature */}
      <motion.div
        animate={{ opacity: exiting ? 0 : 1, y: exiting ? 14 : 0 }}
        transition={{ duration: 0.22 }}
        className="relative z-20 flex w-full items-center justify-between font-mono text-[11px] text-slate-500"
      >
        <span>SYSTEMS · FULL-STACK</span>
        <span className="font-editorial text-sm text-slate-300">Built for speed &amp; clarity</span>
        <span>ENTER / ESC</span>
      </motion.div>
    </div>
  );
};
