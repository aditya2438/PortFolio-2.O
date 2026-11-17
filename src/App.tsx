import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { AmbientCanvas } from './components/AmbientCanvas';
import { CommandPalette } from './components/CommandPalette';
import { ContactSection } from './components/ContactSection';
import { HeroSection } from './components/HeroSection';
import { JourneySection } from './components/JourneySection';
import { MiniGameSection } from './components/MiniGameSection';
import { Navbar, StudioMood } from './components/Navbar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Preloader } from './components/Preloader';
import { ProjectsSection } from './components/ProjectsSection';
import { ResumeModal } from './components/ResumeModal';
import { WhatsAppLogo } from './components/SkillIcons';
import { SkillsSection } from './components/SkillsSection';
import { PROFILE } from './data/portfolioData';
import { buildWhatsAppHref } from './utils/portfolioLogic';

const SECTION_RAIL = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Stack' },
  { id: 'journey', label: 'Journey' },
  { id: 'play', label: 'Arcade' },
  { id: 'contact', label: 'Connect' },
];

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [mood, setMood] = useState<StudioMood>('aurora');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });

  useEffect(() => {
    document.documentElement.dataset.mood = mood;
  }, [mood]);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setScrollPct(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-38% 0px -48% 0px', threshold: 0.01 },
    );

    SECTION_RAIL.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onGlobalKey);
    return () => window.removeEventListener('keydown', onGlobalKey);
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent text-[#f8fafc]">
      {/* Architectural 5-Column Kinetic Louver Signature Preloader */}
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

      {/* Subtle Top Scroll Progress Bar */}
      <motion.div
        style={{ scaleX }}
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-[#22d3ee] via-[#c084fc] to-[#ff9f1c]"
      />

      {/* Silky Flowing Liquid Water Ribbons & Optical Frosted Glass Caustics */}
      <div aria-hidden="true" className="liquid-caustic-layer">
        <div className="liquid-orb-a" />
        <div className="liquid-orb-b" />
      </div>
      <AmbientCanvas />

      <Navbar
        onOpenResume={() => setResumeOpen(true)}
        onOpenCommand={() => setCommandOpen(true)}
        mood={mood}
        onChangeMood={setMood}
      />

      {/* Minimal Floating Right-Edge Section Rail (Large Desktop Only) */}
      <nav
        aria-label="Section quick rail"
        className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2.5 2xl:flex"
      >
        {SECTION_RAIL.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex items-center gap-2 cursor-pointer"
            >
              <span
                className={`font-mono text-[10px] tracking-wider uppercase transition-all ${
                  isActive
                    ? 'opacity-100 text-[#22d3ee] font-semibold'
                    : 'opacity-0 translate-x-1 text-slate-400 group-hover:opacity-100 group-hover:translate-x-0'
                }`}
              >
                {item.label}
              </span>
              <span
                className={`block rounded-full transition-all duration-200 ${
                  isActive
                    ? 'h-2.5 w-2.5 bg-[#22d3ee] shadow-[0_0_12px_#22d3ee]'
                    : 'h-1.5 w-1.5 bg-white/25 group-hover:bg-white/70'
                }`}
              />
            </button>
          );
        })}
      </nav>

      <main className="relative z-10">
        <HeroSection onOpenResume={() => setResumeOpen(true)} />

        <ProjectsSection />

        <SkillsSection />

        <JourneySection />

        <MiniGameSection />

        <ContactSection />
      </main>

      {/* Clean Studio Footer */}
      <footer className="relative z-10 border-t border-white/10 py-6">
        <div className="mx-auto flex max-w-[1380px] 2xl:max-w-[1520px] flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} {PROFILE.name}. Crafted with React, TypeScript &amp; Motion.
          </p>

          <div className="flex items-center gap-3">
            <a
              href={buildWhatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-[#22d3ee]/35 bg-[#22d3ee]/10 px-3.5 py-1.5 font-mono text-xs text-[#22d3ee] transition-colors hover:bg-[#22d3ee]/20"
            >
              <WhatsAppLogo className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-slate-300 transition-colors hover:border-[#22d3ee]/45 hover:text-[#22d3ee] cursor-pointer"
            >
              <span className="font-mono text-[11px] tabular-nums">{scrollPct}%</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </footer>

      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onOpenResume={() => setResumeOpen(true)}
      />
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
      <OfflineIndicator />
    </div>
  );
}
