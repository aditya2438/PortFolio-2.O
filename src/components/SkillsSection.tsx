import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Dices, RotateCcw } from 'lucide-react';
import { FIT_CRITERIA, SKILLS, SkillCategory, SkillItem } from '../data/portfolioData';
import { triggerConfettiBurst } from '../utils/confetti';
import { computeTeamFitResult, filterSkillsByCategory } from '../utils/portfolioLogic';
import { SKILL_BRAND_META, SkillLogo } from './SkillIcons';
import { SpotlightCard } from './SpotlightCard';

const CATEGORIES: { id: SkillCategory; label: string }[] = [
  { id: 'all', label: 'All Stack' },
  { id: 'languages', label: 'Languages' },
  { id: 'backend', label: 'Backend & AI' },
  { id: 'databases', label: 'Databases' },
  { id: 'tools', label: 'DevOps' },
];

export const SkillsSection: React.FC = () => {
  const [category, setCategory] = useState<SkillCategory>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem>(SKILLS[0]);
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>(['java', 'db', 'scale']);

  const filtered = filterSkillsByCategory(SKILLS, category);
  const fitResult = computeTeamFitResult(FIT_CRITERIA, selectedCriteria);
  const activeBrand = SKILL_BRAND_META[selectedSkill.id] || {
    accent: '#22d3ee',
    tint: 'rgba(34, 211, 238, 0.16)',
    mastery: 90,
  };

  const toggleCriterion = (id: string) => {
    setSelectedCriteria((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (next.length === FIT_CRITERIA.length) {
        triggerConfettiBurst(0.75, 0.55);
      }
      return next;
    });
  };

  const handleSurpriseSkill = () => {
    const pool = filtered.length > 1 ? filtered.filter((s) => s.id !== selectedSkill.id) : filtered;
    const pick = pool[Math.floor(Math.random() * pool.length)] || SKILLS[0];
    setSelectedSkill(pick);
    triggerConfettiBurst(0.28, 0.48);
  };

  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (fitResult.score / 100) * circumference;

  const ribbonFirstHalf = SKILLS.slice(0, 10);
  const ribbonSecondHalf = SKILLS.slice(10);

  return (
    <section id="skills" className="scroll-mt-24 py-10 sm:py-14">
      <div className="mx-auto max-w-[1380px] 2xl:max-w-[1520px] px-4 sm:px-6 lg:px-8">
        {/* Interactive Skills Matrix Header + Single-Line Filter Tabs */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-xs font-semibold tracking-[0.14em] text-[#22d3ee]">
              Skills &amp; Interactive Fit Check
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#f8fafc] sm:text-3xl lg:text-4xl">
              Tools I ship with—and how{' '}
              <span className="font-editorial text-gradient-aurora font-semibold">well</span> I match
              your team.
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter skills by category"
            className="flex items-center justify-between gap-0.5 overflow-x-auto rounded-xl border border-white/10 bg-[#0d132b]/70 p-1 sm:gap-1 lg:flex-nowrap shrink-0"
          >
            {CATEGORIES.map((cat) => {
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(cat.id)}
                  className={`relative rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer sm:px-3 sm:text-xs ${
                    active ? 'text-[#060919]' : 'text-slate-300 hover:text-[#f8fafc]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="skill-filter-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      className="absolute inset-0 rounded-lg bg-[#22d3ee]"
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dual-Direction Official Brand Logo Showcase Ribbon */}
        <div className="mt-5 space-y-1.5 overflow-hidden rounded-2xl border border-white/10 bg-[#0d132b]/65 py-2 backdrop-blur-md">
          <div className="animate-marquee items-center">
            {[...ribbonFirstHalf, ...ribbonFirstHalf].map((s, idx) => {
              const meta = SKILL_BRAND_META[s.id];
              return (
                <button
                  key={`r1-${s.id}-${idx}`}
                  type="button"
                  onClick={() => setSelectedSkill(s)}
                  className="mx-2 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1 transition-colors hover:border-[#22d3ee]/50 hover:bg-white/[0.09] cursor-pointer"
                >
                  <SkillLogo id={s.id} className="h-4.5 w-4.5 shrink-0" />
                  <span className="font-mono text-[11px] font-semibold text-slate-200 whitespace-nowrap">
                    {s.name}
                  </span>
                  {meta && (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: meta.accent }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <div className="animate-marquee-reverse items-center">
            {[...ribbonSecondHalf, ...ribbonSecondHalf].map((s, idx) => {
              const meta = SKILL_BRAND_META[s.id];
              return (
                <button
                  key={`r2-${s.id}-${idx}`}
                  type="button"
                  onClick={() => setSelectedSkill(s)}
                  className="mx-2 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1 transition-colors hover:border-[#ff9f1c]/50 hover:bg-white/[0.09] cursor-pointer"
                >
                  <SkillLogo id={s.id} className="h-4.5 w-4.5 shrink-0" />
                  <span className="font-mono text-[11px] font-semibold text-slate-200 whitespace-nowrap">
                    {s.name}
                  </span>
                  {meta && (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: meta.accent }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Skill Detail Callout + Brand Proficiency Meter + Randomizer */}
        <div
          aria-live="polite"
          style={{
            borderColor: `${activeBrand.accent}45`,
            boxShadow: `0 10px 30px -16px ${activeBrand.accent}55`,
          }}
          className="glass-surface-subtle mt-4 flex flex-col justify-between gap-3 rounded-2xl border p-3.5 transition-all sm:flex-row sm:items-center sm:px-5"
        >
          <div className="flex items-start gap-3.5 sm:items-center">
            <motion.div
              key={selectedSkill.id}
              initial={{ scale: 0.72, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 360, damping: 18 }}
              style={{
                borderColor: `${activeBrand.accent}66`,
                backgroundColor: activeBrand.tint,
              }}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border p-1.5 shadow-lg"
            >
              <SkillLogo id={selectedSkill.id} className="h-8 w-8" />
            </motion.div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-display text-sm font-bold text-[#f8fafc] sm:text-base">
                  {selectedSkill.name}
                </span>
                <span aria-hidden="true" className="text-slate-500">·</span>
                <span className="font-mono font-semibold" style={{ color: activeBrand.accent }}>
                  {selectedSkill.level}
                </span>
                <span aria-hidden="true" className="text-slate-500">·</span>
                <span className="text-slate-400">Used in: {selectedSkill.usedIn.join(', ')}</span>
              </div>
              <p className="mt-0.5 font-editorial text-base text-slate-200 sm:text-lg">
                {selectedSkill.witNote}
              </p>
              {/* Brand-Colored Proficiency Gauge Bar */}
              <div className="mt-2 flex max-w-xs items-center gap-2.5">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    key={`bar-${selectedSkill.id}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${activeBrand.mastery}%` }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: activeBrand.accent }}
                  />
                </div>
                <span className="font-mono text-[10px] tabular-nums text-slate-300">
                  {activeBrand.mastery}% fluency
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <motion.button
              type="button"
              onClick={handleSurpriseSkill}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#22d3ee]/45 bg-[#22d3ee]/12 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-[#22d3ee] transition-colors hover:bg-[#22d3ee]/22 cursor-pointer"
            >
              <Dices className="h-3.5 w-3.5" />
              <span>Random Skill</span>
            </motion.button>
            <span className="font-mono text-xs tabular-nums text-slate-400">
              {filtered.length}/{SKILLS.length}
            </span>
          </div>
        </div>

        {/* Multi-Device Compact Grid: 4 cols Mobile/Tablet -> 5 cols Desktop */}
        <motion.div
          layout
          className="mt-4 grid grid-cols-4 gap-1.5 sm:gap-2.5 lg:grid-cols-5"
        >
          {filtered.map((skill) => {
            const isSelected = selectedSkill.id === skill.id;
            const meta = SKILL_BRAND_META[skill.id] || {
              accent: '#22d3ee',
              tint: 'rgba(34, 211, 238, 0.16)',
              mastery: 90,
            };
            return (
              <motion.button
                key={skill.id}
                layout
                type="button"
                onClick={() => setSelectedSkill(skill)}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15 }}
                style={{
                  borderColor: isSelected ? meta.accent : `${meta.accent}28`,
                  background: isSelected
                    ? `linear-gradient(135deg, ${meta.tint}, rgba(13, 19, 43, 0.92))`
                    : `linear-gradient(135deg, rgba(16, 23, 52, 0.82), rgba(10, 15, 36, 0.9))`,
                  boxShadow: isSelected ? `0 12px 26px -14px ${meta.accent}95` : undefined,
                }}
                className={`group relative flex flex-col items-center justify-between gap-1.5 overflow-hidden rounded-xl border px-1.5 py-2 text-center transition-all cursor-pointer sm:flex-row sm:items-center sm:gap-3 sm:p-3 sm:text-left ${
                  isSelected ? 'shadow-lg' : 'hover:border-white/30'
                }`}
              >
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.35 }}
                  style={{
                    borderColor: `${meta.accent}48`,
                    backgroundColor: meta.tint,
                    boxShadow: `0 0 18px -6px ${meta.accent}66`,
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-transform duration-200 group-hover:scale-105 sm:h-11 sm:w-11 sm:rounded-xl"
                >
                  <SkillLogo id={skill.id} className="h-5 w-5 sm:h-7 sm:w-7" />
                </motion.div>

                <div className="w-full min-w-0 flex-1">
                  <div className="flex items-center justify-center gap-1 sm:justify-between">
                    <span className="line-clamp-2 font-display text-[10.5px] leading-tight font-bold text-[#f8fafc] sm:line-clamp-none sm:truncate sm:text-sm">
                      {skill.name}
                    </span>
                    <span
                      className="hidden font-mono text-[9px] font-semibold tabular-nums sm:inline"
                      style={{ color: meta.accent }}
                    >
                      {meta.mastery}%
                    </span>
                  </div>
                  <span
                    className="mt-0.5 hidden truncate font-mono text-[10px] sm:block"
                    style={{ color: isSelected ? meta.accent : 'rgba(203, 213, 225, 0.78)' }}
                  >
                    {skill.level}
                  </span>
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${meta.mastery}%`,
                        backgroundColor: meta.accent,
                        opacity: isSelected ? 1 : 0.65,
                      }}
                    />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Compact Interactive Team Compatibility Gauge */}
        <SpotlightCard className="mt-6 p-5 sm:p-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-lg font-bold text-[#f8fafc] sm:text-xl">
                  Interactive Team Match Builder
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCriteria(FIT_CRITERIA.map((c) => c.id));
                    triggerConfettiBurst(0.75, 0.55);
                  }}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#22d3ee] hover:text-[#67e8f9] cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Select All</span>
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {FIT_CRITERIA.map((criterion) => {
                  const checked = selectedCriteria.includes(criterion.id);
                  return (
                    <motion.button
                      key={criterion.id}
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      onClick={() => toggleCriterion(criterion.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition-colors cursor-pointer ${
                        checked
                          ? 'border-[#22d3ee]/55 bg-[#22d3ee]/12'
                          : 'border-white/10 bg-[#060919]/55 hover:border-white/25'
                      }`}
                    >
                      <span
                        className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                          checked
                            ? 'border-[#22d3ee] bg-[#22d3ee] text-[#060919]'
                            : 'border-white/25 bg-transparent text-transparent'
                        }`}
                      >
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                      <span className="min-w-0 text-[11px] font-semibold leading-snug text-[#f8fafc]">
                        {criterion.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Animated SVG Radial Gauge + Verdict */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#060919]/60 p-4 text-center lg:col-span-4">
              <div className="relative flex h-24 w-24 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 112 112" aria-hidden="true">
                  <circle
                    cx="56"
                    cy="56"
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="56"
                    cy="56"
                    r={radius}
                    fill="none"
                    stroke="url(#fitGaugeGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  />
                  <defs>
                    <linearGradient id="fitGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="55%" stopColor="#c084fc" />
                      <stop offset="100%" stopColor="#ff9f1c" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-2xl font-bold text-[#22d3ee] tabular-nums">
                    {fitResult.score}%
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">Team Match</span>
                </div>
              </div>

              <h4 className="mt-2.5 font-display text-sm font-bold text-[#f8fafc] sm:text-base">
                {fitResult.headline}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                {fitResult.verdict}
              </p>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
};
