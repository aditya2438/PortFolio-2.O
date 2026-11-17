import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Briefcase,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Gamepad2,
  GraduationCap,
  Mail,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { PROFILE } from '../data/portfolioData';
import { triggerConfettiBurst } from '../utils/confetti';
import { buildWhatsAppHref } from '../utils/portfolioLogic';
import { triggerResumePdfDownload } from './ResumeModal';
import { WhatsAppLogo } from './SkillIcons';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onOpenResume: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  hint: string;
  category: 'Jump To' | 'Quick Action' | 'Projects';
  icon: React.ReactNode;
  run: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  onOpenResume,
}) => {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = useMemo(
    () => [
      {
        id: 'work',
        label: 'Selected Projects (FairCart & FixOra)',
        hint: '#work',
        category: 'Jump To',
        icon: <Briefcase className="h-4 w-4 text-[#22d3ee]" />,
        run: () => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }),
      },
      {
        id: 'skills',
        label: '20-Stack Official Skills & Team Match',
        hint: '#skills',
        category: 'Jump To',
        icon: <Code2 className="h-4 w-4 text-[#c084fc]" />,
        run: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }),
      },
      {
        id: 'journey',
        label: 'Academic Journey & Credentials',
        hint: '#journey',
        category: 'Jump To',
        icon: <GraduationCap className="h-4 w-4 text-[#ff9f1c]" />,
        run: () => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' }),
      },
      {
        id: 'play',
        label: 'Bug Smasher Paddle Arcade Game',
        hint: '#play',
        category: 'Jump To',
        icon: <Gamepad2 className="h-4 w-4 text-[#fb7185]" />,
        run: () => document.getElementById('play')?.scrollIntoView({ behavior: 'smooth' }),
      },
      {
        id: 'contact',
        label: 'Direct Gmail Inbox & Contact Form',
        hint: '#contact',
        category: 'Jump To',
        icon: <Mail className="h-4 w-4 text-[#22d3ee]" />,
        run: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }),
      },
      {
        id: 'resume',
        label: 'View Interactive Resume',
        hint: 'Modal',
        category: 'Quick Action',
        icon: <FileText className="h-4 w-4 text-[#ff9f1c]" />,
        run: () => onOpenResume(),
      },
      {
        id: 'resume-tab',
        label: 'Open Resume PDF in New Tab',
        hint: 'New Tab',
        category: 'Quick Action',
        icon: <ExternalLink className="h-4 w-4 text-[#22d3ee]" />,
        run: () => window.open(PROFILE.resumeUrl, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'resume-download',
        label: 'Download Resume PDF',
        hint: 'PDF File',
        category: 'Quick Action',
        icon: <Download className="h-4 w-4 text-[#fbbf24]" />,
        run: () => void triggerResumePdfDownload(),
      },
      {
        id: 'copy-gmail',
        label: `Copy Gmail (${PROFILE.email})`,
        hint: 'Clipboard',
        category: 'Quick Action',
        icon: <Copy className="h-4 w-4 text-[#22d3ee]" />,
        run: () => {
          navigator.clipboard?.writeText(PROFILE.email).catch(() => {});
          triggerConfettiBurst(0.5, 0.45);
        },
      },
      {
        id: 'whatsapp',
        label: 'Open Direct WhatsApp Chat',
        hint: 'External',
        category: 'Quick Action',
        icon: <WhatsAppLogo className="h-4 w-4 text-[#3ecf8e]" />,
        run: () => window.open(buildWhatsAppHref(), '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'confetti',
        label: 'Trigger Celebration Confetti Burst',
        hint: 'Fun',
        category: 'Quick Action',
        icon: <Sparkles className="h-4 w-4 text-[#facc15]" />,
        run: () => triggerConfettiBurst(0.5, 0.45),
      },
      {
        id: 'faircart-live',
        label: 'FairCart — Live E-Commerce Demo',
        hint: 'Vercel',
        category: 'Projects',
        icon: <Briefcase className="h-4 w-4 text-[#3ecf8e]" />,
        run: () => window.open('https://faircart-ten.vercel.app/', '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'fixora-live',
        label: 'FixOra — Local Service Booking Demo',
        hint: 'Render',
        category: 'Projects',
        icon: <Briefcase className="h-4 w-4 text-[#c084fc]" />,
        run: () => window.open('https://fixora-xn4k.onrender.com', '_blank', 'noopener,noreferrer'),
      },
    ],
    [onOpenResume],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q) ||
        it.hint.toLowerCase().includes(q),
    );
  }, [items, query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      window.setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  useEffect(() => {
    if (activeIdx >= filtered.length) {
      setActiveIdx(0);
    }
  }, [filtered.length, activeIdx]);

  const executeItem = (item: CommandItem) => {
    onClose();
    window.setTimeout(() => item.run(), 40);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((prev) => (filtered.length ? (prev + 1) % filtered.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((prev) =>
        filtered.length ? (prev - 1 + filtered.length) % filtered.length : 0,
      );
    } else if (e.key === 'Enter' && filtered[activeIdx]) {
      e.preventDefault();
      executeItem(filtered[activeIdx]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
          className="fixed inset-0 z-[90] flex items-start justify-center bg-black/70 px-4 pt-20 backdrop-blur-sm sm:pt-28"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Quick Command Palette"
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            className="glass-surface w-full max-w-lg overflow-hidden rounded-2xl border border-[#22d3ee]/30 shadow-2xl"
          >
            {/* Search Input Header */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-[#22d3ee]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to Projects, Skills, Game, Resume, or Email..."
                aria-label="Search commands"
                className="w-full bg-transparent text-sm text-[#f8fafc] placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close command palette"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Filtered Action List */}
            <div className="max-h-72 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-3 py-6 text-center font-mono text-xs text-slate-400">
                  No matching action for &ldquo;{query}&rdquo;
                </p>
              ) : (
                filtered.map((item, idx) => {
                  const selected = idx === activeIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => executeItem(item)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#22d3ee]/14 text-[#f8fafc]'
                          : 'text-slate-300 hover:bg-white/[0.05]'
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#060919]/75">
                          {item.icon}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-semibold sm:text-sm">
                            {item.label}
                          </span>
                          <span className="block font-mono text-[10px] text-slate-400">
                            {item.category}
                          </span>
                        </span>
                      </span>
                      <span className="shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-slate-300">
                        {item.hint}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Shortcuts Hint */}
            <div className="flex items-center justify-between border-t border-white/10 bg-[#060919]/75 px-4 py-2 font-mono text-[10px] text-slate-400">
              <span>↑↓ Navigate · ↵ Select</span>
              <span>ESC to close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
