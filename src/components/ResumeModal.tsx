import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  X,
} from 'lucide-react';
import { PROFILE } from '../data/portfolioData';
import { triggerConfettiBurst } from '../utils/confetti';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

export async function triggerResumePdfDownload(): Promise<void> {
  triggerConfettiBurst(0.7, 0.25);
  try {
    const res = await fetch(PROFILE.resumeUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error('PDF fetch failed');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Aditya_Chouhan_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  } catch {
    const fallbackLink = document.createElement('a');
    fallbackLink.href = PROFILE.resumeDownloadUrl || PROFILE.resumeUrl;
    fallbackLink.download = 'Aditya_Chouhan_Resume.pdf';
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    fallbackLink.remove();
  }
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ open, onClose }) => {
  const [viewMode, setViewMode] = useState<'sheet' | 'pdf'>('sheet');
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (!open) return;
    setViewMode('sheet');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const handleDownload = async () => {
    await triggerResumePdfDownload();
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 2200);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-lg sm:p-6"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Aditya Chouhan Resume Preview"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-surface flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#22d3ee]/25"
          >
            {/* Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#06091f]/90 px-4 py-3 sm:px-6">
              <div className="flex min-w-0 items-center gap-2.5">
                <FileText className="h-4 w-4 shrink-0 text-[#22d3ee]" />
                <span className="truncate font-mono text-xs font-semibold text-[#f8fafc] sm:text-sm">
                  Aditya_Chouhan_Resume.pdf
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Interactive Sheet vs Native PDF View Switcher */}
                <div
                  role="tablist"
                  aria-label="Resume view mode"
                  className="inline-flex rounded-xl border border-white/12 bg-white/[0.04] p-0.5"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === 'sheet'}
                    onClick={() => setViewMode('sheet')}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                      viewMode === 'sheet'
                        ? 'bg-[#22d3ee] text-[#06091f]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    <span>Interactive</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === 'pdf'}
                    onClick={() => setViewMode('pdf')}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                      viewMode === 'pdf'
                        ? 'bg-[#22d3ee] text-[#06091f]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <FileText className="h-3 w-3" />
                    <span>PDF File</span>
                  </button>
                </div>

                <a
                  href={PROFILE.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-[#22d3ee]/50 hover:bg-white/10 hover:text-[#22d3ee] whitespace-nowrap"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open in New Tab</span>
                </a>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#ff9f1c] to-[#fbbf24] px-3.5 py-1.5 text-xs font-bold text-[#06091f] transition-all hover:brightness-110 whitespace-nowrap cursor-pointer"
                >
                  {downloaded ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
                  <span>{downloaded ? 'Saved PDF!' : 'Download PDF'}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close resume preview"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-300 transition-colors hover:bg-[#fb7185]/20 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content Area: Interactive Sheet (always renders cleanly even in sandboxed iframes) OR Native PDF */}
            {viewMode === 'sheet' ? (
              <div className="flex-1 overflow-y-auto bg-[#0b1026] p-3 sm:p-6">
                <article className="mx-auto max-w-3xl rounded-xl bg-[#ffffff] p-6 text-[#111827] shadow-2xl sm:p-10">
                  {/* Resume Header */}
                  <header className="border-b-2 border-[#0f172a] pb-4 text-center">
                    <h2 className="font-serif text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
                      Aditya Chouhan
                    </h2>
                    <p className="mt-1 text-sm font-medium text-[#334155]">
                      Software Developer Intern
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-[#1e293b]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#0284c7]" />
                        Ujjain, M.P.
                      </span>
                      <span aria-hidden="true">|</span>
                      <a href={PROFILE.phoneHref} className="inline-flex items-center gap-1 hover:text-[#0284c7]">
                        <Phone className="h-3 w-3 text-[#0284c7]" />
                        +91 7880209425
                      </a>
                      <span aria-hidden="true">|</span>
                      <a
                        href={`mailto:${PROFILE.email}`}
                        className="inline-flex items-center gap-1 font-medium text-[#0284c7] underline underline-offset-2"
                      >
                        <Mail className="h-3 w-3" />
                        {PROFILE.email}
                      </a>
                      <span aria-hidden="true">|</span>
                      <a
                        href={PROFILE.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-[#0284c7] underline underline-offset-2"
                      >
                        <Linkedin className="h-3 w-3" />
                        LinkedIn
                      </a>
                      <span aria-hidden="true">|</span>
                      <a
                        href={PROFILE.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-[#0284c7] underline underline-offset-2"
                      >
                        <Github className="h-3 w-3" />
                        GitHub
                      </a>
                    </div>
                  </header>

                  {/* Professional Summary */}
                  <section className="mt-5">
                    <h3 className="border-b border-[#cbd5e1] pb-1 font-serif text-base font-bold text-[#0f172a]">
                      Professional Summary
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#1e293b] sm:text-[13px]">
                      Highly motivated Java Backend Developer and Computer Science engineering student (Expected
                      Graduation: 2026) with hands-on expertise in engineering scalable microservices, distributed
                      architectures, and high-throughput RESTful APIs. Proficient in modern Java ecosystems (Java 21,
                      Spring Boot 3.3) and normalized relational database design (PostgreSQL, MySQL). Passionate about
                      leveraging cloud-native technologies (Docker, Apache Kafka) and AI integrations (Spring AI) to
                      solve complex system design challenges and build fault-tolerant web applications.
                    </p>
                  </section>

                  {/* Education */}
                  <section className="mt-5">
                    <h3 className="border-b border-[#cbd5e1] pb-1 font-serif text-base font-bold text-[#0f172a]">
                      Education
                    </h3>
                    <div className="mt-2 space-y-2.5 text-xs sm:text-[13px]">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <p className="font-bold text-[#0f172a]">
                            Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore, MP
                          </p>
                          <p className="italic text-[#334155]">
                            Bachelor of Technology (B.Tech) in Computer Science &amp; Engineering
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#0f172a]">2022–2026</p>
                          <p className="italic text-[#334155]">CGPA: 6.98</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <p className="font-bold text-[#0f172a]">Ujjain Public School, Ujjain, MP</p>
                          <p className="italic text-[#334155]">
                            Class XII (Senior Secondary) – Science (PCM), MP Board
                          </p>
                        </div>
                        <p className="font-semibold text-[#0f172a]">2021–2022</p>
                      </div>

                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <p className="font-bold text-[#0f172a]">Jolly Memorial Mission School, Ujjain, MP</p>
                          <p className="italic text-[#334155]">Class X (Secondary School), CBSE Board</p>
                        </div>
                        <p className="font-semibold text-[#0f172a]">2019–2020</p>
                      </div>
                    </div>
                  </section>

                  {/* Technical Skills */}
                  <section className="mt-5">
                    <h3 className="border-b border-[#cbd5e1] pb-1 font-serif text-base font-bold text-[#0f172a]">
                      Technical Skills
                    </h3>
                    <ul className="mt-2 space-y-1 text-xs leading-relaxed text-[#1e293b] sm:text-[13px]">
                      <li>
                        <strong>Programming Languages:</strong> Java (21/17), JavaScript (ES6+), C++, SQL, HTML5, CSS3.
                      </li>
                      <li>
                        <strong>Backend &amp; Frameworks:</strong> Spring Boot 3.3, Spring Security, Spring AI,
                        Hibernate/JPA, RESTful APIs, Microservices, JDBC, JSP.
                      </li>
                      <li>
                        <strong>Databases &amp; Caching:</strong> PostgreSQL, MySQL 8.0 (3NF/ACID), MongoDB, Redis,
                        Supabase.
                      </li>
                      <li>
                        <strong>DevOps &amp; Tools:</strong> Docker, Apache Kafka, Git, GitHub, Maven, Gradle, Postman,
                        JUnit 5, Vercel, Render.
                      </li>
                      <li>
                        <strong>Core Competencies:</strong> Data Structures &amp; Algorithms, Object-Oriented Programming,
                        Database Indexing, JWT &amp; OAuth2, CI/CD Pipelines.
                      </li>
                    </ul>
                  </section>

                  {/* Projects */}
                  <section className="mt-5">
                    <h3 className="border-b border-[#cbd5e1] pb-1 font-serif text-base font-bold text-[#0f172a]">
                      Projects
                    </h3>

                    <div className="mt-2.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-xs sm:text-[13px]">
                          <strong className="text-[#0f172a]">FairCart</strong> |{' '}
                          <span className="italic text-[#334155]">AI-Powered Distributed E-Commerce Platform</span>
                        </p>
                        <div className="flex items-center gap-2 text-xs font-medium text-[#0284c7]">
                          <a
                            href="https://faircart-ten.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2"
                          >
                            Live Demo
                          </a>
                          <span className="text-[#64748b]">|</span>
                          <a
                            href="https://github.com/aditya2438/FairCart"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2"
                          >
                            GitHub
                          </a>
                        </div>
                      </div>
                      <p className="mt-0.5 text-[11px] font-medium text-[#475569]">
                        Java 21, Spring Boot 3.3, Microservices, Apache Kafka, Redis, PostgreSQL, Docker
                      </p>
                      <ul className="mt-1.5 list-disc space-y-1 pl-5 text-xs leading-relaxed text-[#1e293b]">
                        <li>
                          Architected a decoupled microservices ecosystem (Auth, Catalog, Cart, Order, Inventory) utilizing
                          Apache Kafka event streams and Dead-Letter Queues (DLQ) to ensure fault-tolerant, asynchronous
                          order dispatching.
                        </li>
                        <li>
                          Integrated Spring AI with Large Language Models (LLMs) to enable real-time dynamic deal
                          negotiation, personalized product recommendations, and automated cart abandonment anomaly
                          detection.
                        </li>
                        <li>
                          Engineered a high-throughput distributed caching layer using Redis, reducing primary database
                          read load by 55% and achieving sub-25ms response latency during simulated concurrent flash-sale
                          traffic.
                        </li>
                        <li>
                          Designed 3NF normalized relational schemas in PostgreSQL using Hibernate/JPA, implementing
                          pessimistic locking to guarantee ACID compliance and eliminate race conditions during
                          high-concurrency checkouts.
                        </li>
                        <li>
                          Enforced stateless JWT and OAuth2 authentication with granular Role-Based Access Control
                          (RBAC), automated unit testing via JUnit 5, and containerized the microservices environment
                          using Docker.
                        </li>
                      </ul>
                    </div>

                    <div className="mt-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-xs sm:text-[13px]">
                          <strong className="text-[#0f172a]">FixOra</strong> |{' '}
                          <span className="italic text-[#334155]">On-Demand Local Service Booking Marketplace</span>
                        </p>
                        <div className="flex items-center gap-2 text-xs font-medium text-[#0284c7]">
                          <a
                            href="https://fixora-xn4k.onrender.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2"
                          >
                            Live Demo
                          </a>
                          <span className="text-[#64748b]">|</span>
                          <a
                            href="https://github.com/aditya2438/Fixora"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2"
                          >
                            GitHub
                          </a>
                        </div>
                      </div>
                      <p className="mt-0.5 text-[11px] font-medium text-[#475569]">
                        Java 21, Spring Boot 3.3, Spring Security, MySQL 8.0, Redis, Docker
                      </p>
                      <ul className="mt-1.5 list-disc space-y-1 pl-5 text-xs leading-relaxed text-[#1e293b]">
                        <li>
                          Built a production-grade service marketplace featuring dedicated, role-based dashboards
                          (Customer, Service Pro, Admin) secured by stateless JWT authentication and BCrypt password
                          encryption.
                        </li>
                        <li>
                          Implemented location-aware service discovery by leveraging the Haversine formula across
                          multiple city clusters, integrated with dynamic, collision-free slot reservation logic.
                        </li>
                        <li>
                          Architected 17 normalized (3NF) database tables in MySQL 8.0 utilizing composite B-Tree
                          indexing, foreign key cascading, and ACID-compliant stored procedures for optimized transaction
                          auditing.
                        </li>
                        <li>
                          Engineered an automated 5-stage job lifecycle pipeline (Booked to Paid) with real-time status
                          tracking, and successfully containerized the application with Docker for seamless cloud
                          deployment on Render.
                        </li>
                      </ul>
                    </div>
                  </section>

                  {/* Certifications */}
                  <section className="mt-5">
                    <h3 className="border-b border-[#cbd5e1] pb-1 font-serif text-base font-bold text-[#0f172a]">
                      Certifications
                    </h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-[#1e293b] sm:text-[13px]">
                      <li>Java Programming &amp; Cloud Computing – NPTEL / IIT Kharagpur</li>
                      <li>Relational Databases &amp; MySQL – Oracle</li>
                    </ul>
                  </section>
                </article>
              </div>
            ) : (
              <div className="relative flex-1 bg-[#06091f]">
                <object
                  data={`${PROFILE.resumeUrl}#view=FitH`}
                  type="application/pdf"
                  aria-label="Aditya Chouhan Resume PDF"
                  className="h-full w-full"
                >
                  <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
                    <FileText className="h-10 w-10 text-[#22d3ee]" />
                    <div className="max-w-md space-y-1.5">
                      <p className="font-display text-lg font-bold text-white">
                        Browser preview blocked inline PDF rendering
                      </p>
                      <p className="text-xs text-slate-300">
                        Use Open in New Tab, Download PDF, or switch back to the Interactive Sheet view above.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      <a
                        href={PROFILE.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#22d3ee] px-4 py-2 text-xs font-bold text-[#06091f]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Open in New Tab</span>
                      </a>
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#ff9f1c] px-4 py-2 text-xs font-bold text-[#06091f] cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                </object>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
