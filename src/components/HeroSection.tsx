import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, Clock, Copy, Download, ExternalLink, FileText, Shuffle, Sparkles } from 'lucide-react';
import {
  FUN_TRUTHS,
  HERO_METRICS,
  HERO_MOODS,
  MoodConfig,
  PROFILE,
} from '../data/portfolioData';
import { triggerConfettiBurst } from '../utils/confetti';
import { getNextTruthIndex } from '../utils/portfolioLogic';
import { triggerResumePdfDownload } from './ResumeModal';
import { SpotlightCard } from './SpotlightCard';

interface HeroSectionProps {
  onOpenResume: () => void;
}

const PHOTO_REACTIONS = ['Chai + Java 21', 'Zero Race Conditions', 'Open to Build'];
const HERO_PHRASES = ['scale cleanly', 'never break', 'stay resilient'];

const LocalClock: React.FC = () => {
  const [istTime, setIstTime] = useState('');

  useEffect(() => {
    const tick = () => {
      setIstTime(
        new Date().toLocaleTimeString('en-IN', {
          timeZone: PROFILE.timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }),
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="mt-0.5 font-mono text-xs font-semibold tabular-nums text-[#faf7f2] sm:text-sm">
      {istTime || 'IST UTC+5:30'}
    </p>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenResume }) => {
  const [moodId, setMoodId] = useState<MoodConfig['id']>('recruiter');
  const [truthIndex, setTruthIndex] = useState(0);
  const [truthCount, setTruthCount] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [photoClicks, setPhotoClicks] = useState(0);
  const [emailCopied, setEmailCopied] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const tiltRef = useRef<HTMLDivElement>(null);
  const tiltRafRef = useRef<number>(0);

  const activeMood = HERO_MOODS.find((m) => m.id === moodId) || HERO_MOODS[0];
  const activeTruth = FUN_TRUTHS[truthIndex];

  useEffect(() => {
    const phraseTimer = window.setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
    }, 2800);
    return () => window.clearInterval(phraseTimer);
  }, []);

  const handleShuffleTruth = () => {
    setTruthIndex((prev) => getNextTruthIndex(prev, FUN_TRUTHS.length));
    setTruthCount((prev) => prev + 1);
    triggerConfettiBurst(0.72, 0.52);
  };

  const handleAvatarReaction = () => {
    setPhotoClicks((c) => c + 1);
    triggerConfettiBurst(0.64, 0.34);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      // Ignore if clipboard blocked
    }
    setEmailCopied(true);
    triggerConfettiBurst(0.32, 0.55);
    window.setTimeout(() => setEmailCopied(false), 2000);
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tiltRafRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    tiltRafRef.current = requestAnimationFrame(() => {
      tiltRafRef.current = 0;
      const node = tiltRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width - 0.5;
      const py = (clientY - rect.top) / rect.height - 0.5;
      node.style.transform = `perspective(1000px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg)`;
    });
  };

  const handleCardMouseLeave = () => {
    if (tiltRafRef.current) {
      cancelAnimationFrame(tiltRafRef.current);
      tiltRafRef.current = 0;
    }
    if (tiltRef.current) {
      tiltRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
  };

  const currentReaction = PHOTO_REACTIONS[photoClicks % PHOTO_REACTIONS.length];

  return (
    <section id="home" className="relative overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-12">
      {/* Optical Liquid Glass Specular Ambient Wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 h-[420px] w-[840px] -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, var(--mood-glow-a) 0%, var(--mood-glow-b) 45%, transparent 72%)',
        }}
      />

      <div className="mx-auto max-w-[1380px] 2xl:max-w-[1520px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-7 lg:grid-cols-12 lg:gap-9">
          {/* Left Expressive Editorial Column */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center lg:col-span-7"
          >
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-slate-400">
              <span className="font-mono font-semibold text-[#22d3ee]">Open for Software Developer Roles</span>
              <span aria-hidden="true">·</span>
              <span>{PROFILE.location}</span>
              <span aria-hidden="true">·</span>
              <span>{PROFILE.graduation}</span>
            </div>

            <h1 className="mt-4 font-display text-[clamp(2.1rem,4.5vw,4.15rem)] font-bold leading-[1.06] tracking-tight text-[#f8fafc]">
              Crafting backends that{' '}
              <span className="relative inline-grid overflow-hidden align-bottom py-0.5">
                <AnimatePresence initial={false}>
                  <motion.span
                    key={phraseIndex}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '-110%' }}
                    transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                    className="col-start-1 row-start-1 font-editorial text-gradient-aurora inline-block pr-1.5 font-semibold whitespace-nowrap"
                  >
                    {HERO_PHRASES[phraseIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>{' '}
              &amp; interfaces that feel alive.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-[17px]">
              Hi, I&apos;m <strong className="font-semibold text-white">Aditya Chouhan</strong>—a
              Computer Science engineer building rock-solid{' '}
              <strong className="font-semibold text-[#22d3ee]">Java 21 &amp; Spring Boot 3.3</strong>{' '}
              backends, sub-25ms <strong className="font-semibold text-white">Redis</strong> caches,
              and <strong className="font-semibold text-white">Kafka</strong> pipelines with crisp,
              human-centered web craft.
            </p>

            {/* Primary & Secondary Magnetic CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3.5">
              <motion.a
                href="#work"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#38bdf8] px-5 py-2.5 text-sm font-bold text-[#060919] shadow-xl shadow-[#22d3ee]/20 transition-all hover:brightness-110 whitespace-nowrap shrink-0"
              >
                <span>Explore Selected Work</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </motion.a>

              <motion.button
                type="button"
                onClick={onOpenResume}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-[#f8fafc] backdrop-blur-md transition-colors hover:border-[#22d3ee]/55 hover:bg-white/10 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <FileText className="h-4 w-4 text-[#ff9f1c]" />
                <span>View Resume</span>
              </motion.button>

              <motion.a
                href={PROFILE.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex min-h-[46px] items-center gap-1.5 rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:border-[#22d3ee]/50 hover:text-[#22d3ee] whitespace-nowrap shrink-0"
              >
                <ExternalLink className="h-3.5 w-3.5 text-[#22d3ee]" />
                <span>Open Resume</span>
              </motion.a>

              <motion.button
                type="button"
                onClick={() => triggerResumePdfDownload()}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex min-h-[46px] items-center gap-1.5 rounded-xl border border-[#ff9f1c]/35 bg-[#ff9f1c]/12 px-3.5 py-2.5 text-xs font-semibold text-[#fbbf24] transition-colors hover:border-[#ff9f1c] hover:bg-[#ff9f1c]/20 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Resume</span>
              </motion.button>
            </div>

            {/* Clean Unboxed Typographic Quick Links */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#f8fafc]"
              >
                GitHub ({PROFILE.githubHandle})
              </a>
              <span aria-hidden="true" className="text-slate-600">/</span>
              <a
                href={PROFILE.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#f8fafc]"
              >
                LinkedIn
              </a>
              <span aria-hidden="true" className="text-slate-600">/</span>
              <a
                href={PROFILE.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#ff9f1c]"
              >
                LeetCode ({PROFILE.leetcodeHandle})
              </a>
              <span aria-hidden="true" className="text-slate-600">/</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 text-slate-300 transition-colors hover:text-[#22d3ee] cursor-pointer"
              >
                {emailCopied ? <Check className="h-3.5 w-3.5 text-[#22d3ee]" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{emailCopied ? 'Copied Gmail!' : PROFILE.email}</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Compact Kinetic Orbit Portrait + Interactive Studio Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3.5 lg:col-span-5"
          >
            <div
              ref={tiltRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transition: 'transform 0.2s ease-out',
                willChange: 'transform',
              }}
            >
              <SpotlightCard className="p-5">
                {/* 3-Mode Kinetic Perspective Switcher */}
                <div
                  role="tablist"
                  aria-label="Portfolio perspective mode"
                  className="grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-[#060919]/65 p-1"
                >
                  {HERO_MOODS.map((m) => {
                    const active = moodId === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setMoodId(m.id)}
                        className={`relative rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-colors cursor-pointer truncate ${
                          active ? 'text-[#060919]' : 'text-slate-300 hover:text-[#f8fafc]'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="hero-mood-tab"
                            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                            className="absolute inset-0 rounded-lg bg-[#22d3ee]"
                          />
                        )}
                        <span className="relative z-10">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Compact Interactive Portrait with Rotating SVG Collar Ring */}
                <div className="my-4 flex items-center gap-4">
                  <motion.button
                    type="button"
                    onClick={handleAvatarReaction}
                    aria-label="Tap portrait for confetti reaction"
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.92, rotate: -6 }}
                    animate={{ rotate: photoClicks * 360 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    className="group relative h-24 w-24 shrink-0 cursor-pointer"
                  >
                    {/* Orbiting Curved Circular Typography Collar */}
                    <motion.svg
                      viewBox="0 0 120 120"
                      aria-hidden="true"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                      className="pointer-events-none absolute -inset-3 h-[calc(100%+24px)] w-[calc(100%+24px)]"
                    >
                      <defs>
                        <path
                          id="avatarOrbitPath"
                          d="M 60, 60 m -48, 0 a 48,48 0 1,1 96,0 a 48,48 0 1,1 -96,0"
                        />
                      </defs>
                      <text
                        fill="#22d3ee"
                        fontSize="7.4"
                        fontWeight="700"
                        letterSpacing="2.4"
                        className="font-mono uppercase opacity-85"
                      >
                        <textPath href="#avatarOrbitPath">
                          JAVA 21 · INDORE · SPRING BOOT · OPEN TO WORK ·
                        </textPath>
                      </text>
                    </motion.svg>

                    {/* Compact Circular Photo Frame */}
                    <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-[#22d3ee]/70 bg-[#0d132b] shadow-lg shadow-[#22d3ee]/15 transition-colors group-hover:border-[#ff9f1c]">
                      {!imgFailed ? (
                        <img
                          src={PROFILE.photoUrl}
                          alt="Profile portrait of Aditya Chouhan"
                          referrerPolicy="no-referrer"
                          onError={() => setImgFailed(true)}
                          className="h-full w-full object-cover object-top"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#0d132b] font-display text-2xl font-bold text-[#22d3ee]">
                          AC
                        </div>
                      )}
                    </div>
                  </motion.button>

                  <div className="min-w-0 flex-1 pl-1">
                    <p className="font-display text-lg font-bold text-[#f8fafc] sm:text-xl">
                      {PROFILE.fullName}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] font-medium text-[#22d3ee]">
                      {photoClicks > 0 ? currentReaction : activeMood.kicker}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      {activeMood.summary}
                    </p>
                  </div>
                </div>

                {/* Addictive Interactive "2 AM Truths" Toy */}
                <div className="rounded-xl border border-white/10 bg-[#060919]/65 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#c084fc]">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{activeTruth.tag}</span>
                    </span>
                    <motion.button
                      type="button"
                      onClick={handleShuffleTruth}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.94 }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#22d3ee]/40 bg-[#22d3ee]/15 px-2.5 py-1 font-mono text-[11px] font-semibold text-[#22d3ee] transition-colors hover:bg-[#22d3ee]/25 cursor-pointer"
                    >
                      <Shuffle className="h-3 w-3" />
                      <span>Next Truth{truthCount > 0 ? ` (${truthCount})` : ''}</span>
                    </motion.button>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.p
                      key={truthIndex}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="mt-2 text-xs leading-relaxed text-slate-300"
                    >
                      {activeTruth.quote}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </SpotlightCard>
            </div>

            {/* Bottom Compact Studio Micro-Tiles */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="glass-surface-subtle flex items-center justify-between rounded-2xl px-4 py-2.5">
                <div>
                  <p className="font-mono text-[10px] tracking-wide text-slate-400">Local Time</p>
                  <LocalClock />
                </div>
                <Clock className="h-4 w-4 shrink-0 text-[#22d3ee]" />
              </div>

              <div className="glass-surface-subtle flex items-center justify-between rounded-2xl px-4 py-2.5">
                <div>
                  <p className="font-mono text-[10px] tracking-wide text-slate-400">SVVV Indore</p>
                  <p className="mt-0.5 font-mono text-xs font-semibold tabular-nums text-[#f8fafc] sm:text-sm">
                    CGPA {PROFILE.cgpa}
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-[#c084fc]">2026</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width 4-Column KPI Strip Below Split */}
        <div className="mt-7 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {HERO_METRICS.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              whileHover={{ y: -3 }}
              className="glass-surface-subtle rounded-2xl p-4 transition-colors hover:border-[#22d3ee]/40"
            >
              <div className="text-gradient-aurora font-display text-2xl font-bold tabular-nums sm:text-3xl">
                {metric.value}
              </div>
              <div className="mt-1 text-xs leading-snug text-slate-400">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dual-Track Kinetic Ribbon Divider */}
      <div className="mt-10 space-y-1.5 border-y border-white/10 bg-[#0d132b]/40 py-2.5 overflow-hidden">
        <div className="animate-marquee font-mono text-xs tracking-[0.18em] text-slate-300 uppercase">
          <span className="mx-6">
            Java 21 · Spring Boot 3.3 · Apache Kafka DLQ · Sub-25ms Redis · PostgreSQL 3NF · Spring AI · MySQL 8.0 · Docker · React &amp; Motion
          </span>
          <span className="mx-6">
            Java 21 · Spring Boot 3.3 · Apache Kafka DLQ · Sub-25ms Redis · PostgreSQL 3NF · Spring AI · MySQL 8.0 · Docker · React &amp; Motion
          </span>
        </div>
        <div className="animate-marquee-reverse font-mono text-[11px] tracking-[0.2em] text-[#22d3ee]/85 uppercase">
          <span className="mx-6">
            FairCart Distributed E-Commerce · FixOra Haversine Booking · Zero Race Conditions · 17-Table 3NF Schemas · Built in Indore &amp; Ujjain
          </span>
          <span className="mx-6">
            FairCart Distributed E-Commerce · FixOra Haversine Booking · Zero Race Conditions · 17-Table 3NF Schemas · Built in Indore &amp; Ujjain
          </span>
        </div>
      </div>
    </section>
  );
};
