import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronDown, ExternalLink, Github } from 'lucide-react';
import { PROJECTS, ProjectItem } from '../data/portfolioData';
import { SkillLogo } from './SkillIcons';
import { SpotlightCard } from './SpotlightCard';

const PROJECT_ICON_MAP: Record<string, { id: string; label: string }[]> = {
  faircart: [
    { id: 'java21', label: 'Java 21' },
    { id: 'springboot', label: 'Spring Boot' },
    { id: 'springai', label: 'Spring AI' },
    { id: 'kafka', label: 'Kafka' },
    { id: 'redis', label: 'Redis' },
    { id: 'postgresql', label: 'PostgreSQL' },
    { id: 'docker', label: 'Docker' },
  ],
  fixora: [
    { id: 'java21', label: 'Java 21' },
    { id: 'springboot', label: 'Spring Boot' },
    { id: 'springsecurity', label: 'Spring Security' },
    { id: 'mysql', label: 'MySQL 8.0' },
    { id: 'redis', label: 'Redis' },
    { id: 'docker', label: 'Docker' },
  ],
  'core-craft': [
    { id: 'java21', label: 'Java 21' },
    { id: 'hibernate', label: 'Hibernate' },
    { id: 'junit', label: 'JUnit 5' },
    { id: 'sql', label: 'B-Tree SQL' },
    { id: 'docker', label: 'Docker' },
  ],
};

const ProjectCard: React.FC<{
  project: ProjectItem;
}> = ({ project }) => {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [deepDiveOpen, setDeepDiveOpen] = useState(false);

  const activeStage = project.stages[activeStageIdx] || project.stages[0];
  const logoIcons = PROJECT_ICON_MAP[project.id] || [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
    >
      <SpotlightCard hoverLift className="p-5 sm:p-7">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Left Architectural Summary, Tabular Metrics & Tech Logos (No Clunky Image Box) */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div>
              <div className="flex items-center gap-2.5 font-mono text-xs text-[#ff9f1c]">
                <span className="font-bold">{project.index}.</span>
                <span className="text-stone-400">{project.categoryText}</span>
              </div>
              <h3 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-[#faf7f2] sm:text-3xl">
                {project.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-[#2ec4b6] sm:text-base">
                {project.tagline}
              </p>
            </div>

            <p className="text-sm leading-relaxed text-stone-300">
              {project.description}
            </p>

            {/* Interactive Brand Stack Logos */}
            <div className="flex flex-wrap items-center gap-2">
              {logoIcons.map((item) => {
                const active = selectedTech === item.label;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    title={item.label}
                    onClick={() => setSelectedTech(active ? null : item.label)}
                    whileHover={{ y: -3, scale: 1.12 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 16 }}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border p-1.5 cursor-pointer transition-colors ${
                      active
                        ? 'border-[#22d3ee] bg-[#22d3ee]/20 shadow-md shadow-[#22d3ee]/20'
                        : 'border-white/10 bg-[#060919]/65 hover:border-[#22d3ee]/50'
                    }`}
                  >
                    <SkillLogo id={item.id} className="h-5 w-5" />
                  </motion.button>
                );
              })}
              {selectedTech && (
                <span className="font-mono text-[11px] font-semibold text-[#22d3ee]">
                  {selectedTech}
                </span>
              )}
            </div>

            {/* Clean Tabular Metrics Strip */}
            <div className="grid grid-cols-3 divide-x divide-white/10 rounded-xl border border-white/10 bg-[#060919]/65 py-3 text-center">
              {project.metrics.map((m) => (
                <div key={m.label} className="px-2">
                  <div className="font-display text-lg font-bold text-[#22d3ee] tabular-nums sm:text-xl">
                    {m.value}
                  </div>
                  <div className="mt-0.5 text-[11px] leading-tight text-slate-400">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Primary Links */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {project.repoUrl && (
                <motion.a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-[#f8fafc] whitespace-nowrap shrink-0 transition-colors hover:border-white/30 hover:bg-white/10"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>View Code</span>
                </motion.a>
              )}

              {project.liveUrl && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#38bdf8] px-4 py-2 text-xs font-bold text-[#060919] whitespace-nowrap shrink-0 shadow-md shadow-[#22d3ee]/20 transition-all hover:brightness-110"
                >
                  <span>See Live Demo</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </motion.a>
              )}
            </div>
          </div>

          {/* Right Interactive Architecture Stage Stepper & Breakdown */}
          <div className="flex flex-col lg:col-span-7">
            {/* Animated Architecture Pipeline */}
            <div className="rounded-xl border border-white/10 bg-[#060919]/65 p-4">
              <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-200">Interactive Architecture Flow</span>
                <span className="font-mono text-[11px] text-[#22d3ee]">Step {activeStageIdx + 1}/{project.stages.length}</span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {project.stages.map((stage, idx) => {
                  const isActive = idx === activeStageIdx;
                  return (
                    <React.Fragment key={stage.id}>
                      <button
                        type="button"
                        onClick={() => setActiveStageIdx(idx)}
                        className={`relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          isActive ? 'text-[#060919]' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-[#f8fafc]'
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId={`stage-${project.id}`}
                            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                            className="absolute inset-0 rounded-lg bg-[#22d3ee]"
                          />
                        )}
                        <span className="relative z-10">{stage.title}</span>
                      </button>
                      {idx < project.stages.length - 1 && (
                        <ArrowRight className="hidden h-3 w-3 text-slate-600 sm:inline shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.16 }}
                  className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-white/10 pt-3 text-xs"
                >
                  <span className="text-slate-200">{activeStage.caption}</span>
                  <span className="font-mono font-semibold text-[#c084fc] shrink-0">{activeStage.highlight}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Key Engineering Highlights */}
            <ul className="mt-4 space-y-2 text-xs text-slate-300 sm:text-sm">
              {project.highlights.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22d3ee]" />
                  <span className="leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>

            {/* Candid Note */}
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs leading-relaxed text-slate-300">
              <span className="font-semibold text-[#c084fc]">Engineering note: </span>
              <span className="font-editorial text-sm sm:text-base text-slate-100">{project.engineerWit}</span>
            </div>

            {/* Expandable Engineering Deep Dive */}
            <div className="mt-4 border-t border-white/10 pt-3">
              <button
                type="button"
                aria-expanded={deepDiveOpen}
                onClick={() => setDeepDiveOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-left text-xs font-semibold text-[#22d3ee] transition-colors hover:bg-white/5 cursor-pointer"
              >
                <span>{deepDiveOpen ? 'Hide Engineering Breakdown' : 'Read Engineering Breakdown'}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${deepDiveOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {deepDiveOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {project.deepDive.map((item) => (
                        <div
                          key={item.title}
                          className="rounded-xl border border-white/10 bg-[#060919]/65 p-3"
                        >
                          <h4 className="font-display text-xs font-bold text-[#f8fafc]">{item.title}</h4>
                          <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.body}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.article>
  );
};

export const ProjectsSection: React.FC = () => {
  return (
    <section id="work" className="scroll-mt-24 py-10 sm:py-14">
      <div className="mx-auto max-w-[1380px] 2xl:max-w-[1520px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-semibold tracking-[0.14em] text-[#22d3ee]">
            Selected Work
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#f8fafc] sm:text-3xl lg:text-4xl">
            Production systems built for{' '}
            <span className="font-editorial text-gradient-solar font-semibold">scale</span>, clarity
            &amp; zero data loss.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">
            Explore real-world microservices, location-aware booking engines, and clean Java architecture—complete
            with live demos and source repositories.
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-6">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};
