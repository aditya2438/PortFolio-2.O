import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Command, Menu, X } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';
import { AnimatedLogo } from './AnimatedLogo';
import { PWAInstallButton } from './PWAInstallButton';

export type StudioMood = 'aurora' | 'solar' | 'emerald' | 'amethyst';

export const MOOD_OPTIONS: { id: StudioMood; label: string; dot: string }[] = [
  { id: 'aurora', label: 'Aurora Cyan', dot: '#22d3ee' },
  { id: 'solar', label: 'Solar Sunset', dot: '#ff9f1c' },
  { id: 'emerald', label: 'Emerald Matrix', dot: '#34d399' },
  { id: 'amethyst', label: 'Royal Amethyst', dot: '#c084fc' },
];

interface NavbarProps {
  onOpenResume: () => void;
  onOpenCommand: () => void;
  mood: StudioMood;
  onChangeMood: (mood: StudioMood) => void;
}

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenResume,
  onOpenCommand,
  mood,
  onChangeMood,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleNavClick = (href: string) => {
    setDrawerOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <div
          className={`mx-auto flex w-full max-w-[1380px] 2xl:max-w-[1520px] items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-all duration-300 sm:px-5 ${
            scrolled
              ? 'glass-surface shadow-2xl shadow-black/75'
              : 'border border-white/12 bg-[#0d132b]/75 backdrop-blur-xl'
          }`}
        >
          {/* Zone 1: Single-line Brand Wordmark + Animated Kinetic Emblem */}
          <a
            href="#home"
            className="inline-flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-[#f8fafc] whitespace-nowrap shrink-0 transition-colors hover:text-[#22d3ee]"
          >
            <AnimatedLogo size="sm" />
            <span>{PROFILE.name}</span>
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-sm font-medium text-slate-300 whitespace-nowrap shrink-0 transition-colors hover:text-[#22d3ee]"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-gradient-to-r from-[#22d3ee] via-[#c084fc] to-[#ff9f1c] transition-all duration-200 group-hover:w-full"
                />
              </a>
            ))}
          </nav>

          {/* Zone 3: Mood Switcher + Quick Jump + Install App + Resume CTA + Mobile Drawer Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              role="group"
              aria-label="Studio color mood"
              className="hidden xl:inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/[0.04] px-2.5 py-2"
            >
              {MOOD_OPTIONS.map((opt) => {
                const active = mood === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    title={`Switch theme to ${opt.label}`}
                    aria-label={`Switch theme to ${opt.label}`}
                    aria-pressed={active}
                    onClick={() => onChangeMood(opt.id)}
                    className={`h-3 w-3 rounded-full transition-transform cursor-pointer ${
                      active ? 'scale-125 ring-2 ring-white/80 ring-offset-1 ring-offset-[#06091f]' : 'opacity-60 hover:opacity-100 hover:scale-110'
                    }`}
                    style={{ backgroundColor: opt.dot }}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={onOpenCommand}
              aria-label="Open quick command palette"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/[0.04] px-2.5 py-2 font-mono text-[11px] font-medium text-slate-300 transition-colors hover:border-[#22d3ee]/50 hover:text-[#22d3ee] cursor-pointer"
            >
              <Command className="h-3.5 w-3.5" />
              <span>K</span>
            </button>

            <PWAInstallButton compact className="hidden sm:inline-flex" />

            <motion.button
              type="button"
              onClick={onOpenResume}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="hidden sm:inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#38bdf8] px-4 py-2 text-xs font-bold text-[#060919] whitespace-nowrap shrink-0 shadow-lg shadow-[#22d3ee]/20 transition-all hover:brightness-110 cursor-pointer"
            >
              View Resume
            </motion.button>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 bg-white/5 text-[#f8fafc] transition-colors hover:bg-white/10 md:hidden cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md md:hidden"
            onClick={() => setDrawerOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto flex h-full w-[min(85vw,340px)] flex-col justify-between border-l border-white/12 bg-[#0d132b]/95 p-6 backdrop-blur-2xl"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="inline-flex items-center gap-2 font-display text-lg font-bold text-[#f8fafc]">
                    <AnimatedLogo size="sm" />
                    <span>{PROFILE.name}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Close navigation menu"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 bg-white/5 text-slate-200 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <ul className="mt-6 flex flex-col gap-2">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(link.href);
                        }}
                        className="flex min-h-[44px] items-center rounded-xl px-3 text-base font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-[#22d3ee]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
                  <span className="font-mono text-[11px] text-slate-400">Studio Aura</span>
                  <div className="flex items-center gap-2">
                    {MOOD_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        aria-label={`Switch theme to ${opt.label}`}
                        aria-pressed={mood === opt.id}
                        onClick={() => onChangeMood(opt.id)}
                        className={`h-4 w-4 rounded-full cursor-pointer ${
                          mood === opt.id ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0d132b]' : 'opacity-65'
                        }`}
                        style={{ backgroundColor: opt.dot }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenCommand();
                  }}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 font-mono text-xs font-semibold text-slate-200 cursor-pointer"
                >
                  <Command className="h-3.5 w-3.5 text-[#22d3ee]" />
                  <span>Quick Jump</span>
                </button>

                <PWAInstallButton className="w-full min-h-[44px]" />

                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenResume();
                  }}
                  className="flex min-h-[46px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#38bdf8] px-5 py-3 text-sm font-bold text-[#060919] cursor-pointer"
                >
                  View Resume
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
