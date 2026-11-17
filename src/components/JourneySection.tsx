import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Award, ChevronDown, GraduationCap, ShieldCheck } from 'lucide-react';
import { CERTIFICATIONS, EDUCATION } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';

export const JourneySection: React.FC = () => {
  const [expandedCertId, setExpandedCertId] = useState<string>(CERTIFICATIONS[0].id);

  return (
    <section id="journey" className="scroll-mt-24 py-10 sm:py-14">
      <div className="mx-auto max-w-[1380px] 2xl:max-w-[1520px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-semibold tracking-[0.14em] text-[#22d3ee]">
            Philosophy, Education &amp; Credentials
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#f8fafc] sm:text-4xl">
            How I think about{' '}
            <span className="font-editorial text-gradient-aurora font-semibold">software craft</span>
            —and where I trained.
          </h2>
        </div>

        {/* Core Engineering Principles */}
        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              num: '01.',
              title: 'Algorithmic Clarity',
              body: 'Data Structures & OOP patterns guide how I keep hot code paths simple, predictable, and easy for teammates to extend.',
            },
            {
              num: '02.',
              title: 'Zero-Oversell ACID Discipline',
              body: 'From 17 normalized 3NF tables in MySQL to pessimistic PostgreSQL write locks, inventory and financial state never drifts.',
            },
            {
              num: '03.',
              title: 'Resilient User Experiences',
              body: 'Decoupled Kafka queues + sub-25ms Redis caching in the backend paired with responsive, human-friendly frontend motion.',
            },
          ].map((pillar) => (
            <SpotlightCard key={pillar.num} hoverLift className="p-5">
              <span className="font-mono text-xs font-bold text-[#22d3ee]">{pillar.num}</span>
              <h3 className="mt-1.5 font-display text-lg font-bold text-[#f8fafc]">{pillar.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{pillar.body}</p>
            </SpotlightCard>
          ))}
        </div>

        {/* Education Timeline + Interactive Certifications Split */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="mb-4 flex items-center gap-2.5">
              <GraduationCap className="h-5 w-5 text-[#22d3ee]" />
              <h3 className="font-display text-xl font-bold text-[#f8fafc]">Academic Background</h3>
            </div>

            <ol className="space-y-3">
              {EDUCATION.map((edu, idx) => (
                <motion.li
                  key={edu.period}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                >
                  <div className="glass-surface-subtle rounded-2xl p-4 transition-colors hover:border-[#22d3ee]/40">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-mono font-semibold text-[#22d3ee] tabular-nums">{edu.period}</span>
                      <span className="font-mono text-slate-400">{edu.score}</span>
                    </div>
                    <h4 className="mt-1 font-display text-base font-bold text-[#f8fafc]">{edu.degree}</h4>
                    <p className="mt-0.5 text-xs font-medium text-slate-300">{edu.institution}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{edu.details}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-6">
            <div className="mb-4 flex items-center gap-2.5">
              <Award className="h-5 w-5 text-[#c084fc]" />
              <h3 className="font-display text-xl font-bold text-[#f8fafc]">Verified Certifications</h3>
            </div>

            <div className="space-y-3">
              {CERTIFICATIONS.map((cert) => {
                const isExpanded = expandedCertId === cert.id;
                return (
                  <SpotlightCard key={cert.id} hoverLift className="p-4 sm:p-5">
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() => setExpandedCertId(isExpanded ? '' : cert.id)}
                      className="flex w-full items-start justify-between gap-3 text-left cursor-pointer"
                    >
                      <div>
                        <p className="font-mono text-xs font-medium text-[#c084fc]">{cert.focus}</p>
                        <h4 className="mt-0.5 font-display text-base font-bold text-[#f8fafc]">{cert.title}</h4>
                        <p className="mt-0.5 text-xs text-slate-400">{cert.issuer}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <ShieldCheck className="h-5 w-5 text-[#22d3ee]" />
                        <ChevronDown
                          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-[#22d3ee]' : ''
                          }`}
                        />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="mt-2.5 text-xs leading-relaxed text-slate-300">{cert.summary}</p>
                          <p className="mt-2.5 border-t border-white/10 pt-2 font-mono text-[11px] text-slate-400">
                            {cert.skills.join(' · ')}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </SpotlightCard>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
