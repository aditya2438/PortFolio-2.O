import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  Github,
  Linkedin,
  Loader2,
  Mail,
  Phone,
  Send,
} from 'lucide-react';
import { CONTACT_STARTERS, PROFILE } from '../data/portfolioData';
import { triggerConfettiBurst } from '../utils/confetti';
import {
  buildGmailComposeHref,
  buildMailtoHref,
  buildWhatsAppHref,
  DirectMessageInput,
  isSafeHref,
  sanitizeUserText,
  validateDirectMessage,
} from '../utils/portfolioLogic';
import { WhatsAppLogo } from './SkillIcons';
import { SpotlightCard } from './SpotlightCard';

interface ContactServerResult {
  ok: boolean;
  inquiryId?: string;
  recipient?: string;
  deliveredViaEmail?: boolean;
  requiresActivation?: boolean;
  provider?: 'resend' | 'formsubmit';
  deliveryNote?: string;
  gmailComposeUrl?: string;
  mailtoUrl?: string;
  errors?: { email?: string; message?: string };
}

export const ContactSection: React.FC = () => {
  const [emailCopied, setEmailCopied] = useState(false);
  const [form, setForm] = useState<DirectMessageInput>({
    email: '',
    message: '',
    topic: 'Portfolio Inquiry',
  });
  const [honeypot, setHoneypot] = useState('');
  const [touched, setTouched] = useState<{ email: boolean; message: boolean }>({
    email: false,
    message: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [submitResult, setSubmitResult] = useState<ContactServerResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validation = validateDirectMessage(form);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      // Ignore if clipboard blocked
    }
    setEmailCopied(true);
    triggerConfettiBurst(0.35, 0.7);
    window.setTimeout(() => setEmailCopied(false), 2000);
  };

  const handleSuccess = () => {
    setIsSent(true);
    setForm({ email: '', message: '', topic: 'Portfolio Inquiry' });
    setTouched({ email: false, message: false });
    setSubmitError(null);
    setSubmitResult(null);
    triggerConfettiBurst(0.65, 0.65);
    window.setTimeout(() => setIsSent(false), 4500);
  };

  const applyStarter = (starter: (typeof CONTACT_STARTERS)[number]) => {
    setForm((prev) => ({
      ...prev,
      topic: starter.topic,
      message: starter.message,
    }));
    setTouched((prev) => ({ ...prev, message: true }));
    setSubmitResult(null);
    setSubmitError(null);
    setIsSent(false);
  };

  const tryClientFormSubmitFallback = async (
    sanitizedEmail: string,
    sanitizedMessage: string,
    sanitizedTopic: string,
  ): Promise<{ delivered: boolean; requiresActivation: boolean; note?: string }> => {
    try {
      const ctrl = new AbortController();
      const timer = window.setTimeout(() => ctrl.abort(), 8000);
      const fd = new FormData();
      fd.append('email', sanitizedEmail);
      fd.append('_replyto', sanitizedEmail);
      fd.append('topic', sanitizedTopic);
      fd.append('message', sanitizedMessage);
      fd.append('_subject', `[Portfolio Message] ${sanitizedTopic} from ${sanitizedEmail}`);
      fd.append('_template', 'table');
      fd.append('_captcha', 'false');

      const res = await fetch(`https://formsubmit.co/ajax/${PROFILE.email}`, {
        method: 'POST',
        signal: ctrl.signal,
        headers: {
          Accept: 'application/json',
        },
        body: fd,
      });
      window.clearTimeout(timer);
      if (res.ok) {
        const json = (await res.json().catch(() => ({}))) as {
          success?: string | boolean;
          message?: string;
        };
        const delivered = json.success === true || json.success === 'true';
        const requiresActivation =
          typeof json.message === 'string' && json.message.toLowerCase().includes('activation');
        return {
          delivered,
          requiresActivation,
          note: typeof json.message === 'string' ? json.message : undefined,
        };
      }
    } catch {
      // Browser relay unavailable
    }
    return { delivered: false, requiresActivation: false };
  };

  const postContactWithRetry = async (payload: {
    email: string;
    message: string;
    topic: string;
    website: string;
  }): Promise<Response> => {
    const endpoint =
      typeof window !== 'undefined'
        ? new URL('/api/contact', window.location.origin).toString()
        : '/api/contact';
    const attempt = async () => {
      const ctrl = new AbortController();
      const timer = window.setTimeout(() => ctrl.abort(), 14000);
      try {
        return await fetch(endpoint, {
          method: 'POST',
          credentials: 'same-origin',
          cache: 'no-store',
          signal: ctrl.signal,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } finally {
        window.clearTimeout(timer);
      }
    };

    try {
      return await attempt();
    } catch {
      await new Promise((r) => window.setTimeout(r, 450));
      return await attempt();
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, message: true });
    setSubmitError(null);

    if (!validation.isValid) {
      setSubmitResult(null);
      return;
    }

    const sanitizedEmail = sanitizeUserText(form.email, 160);
    const sanitizedMessage = sanitizeUserText(form.message, 2000, true);
    const sanitizedTopic = sanitizeUserText(form.topic || 'Portfolio Inquiry', 80) || 'Portfolio Inquiry';

    setSubmitting(true);
    try {
      const response = await postContactWithRetry({
        email: sanitizedEmail,
        message: sanitizedMessage,
        topic: sanitizedTopic,
        website: honeypot,
      });

      const rawText = await response.text();
      let data: (ContactServerResult & { error?: string; message?: string }) | null = null;
      try {
        data = JSON.parse(rawText) as ContactServerResult & { error?: string; message?: string };
      } catch {
        data = null;
      }

      if (response.status === 400 && (data?.errors?.email || data?.errors?.message)) {
        setSubmitError(data.errors.email || data.errors.message || 'Please check your email and message.');
        setSubmitResult(null);
        return;
      }

      if (!data || !response.ok || !data.ok) {
        const serverMsg =
          data?.errors?.email ||
          data?.errors?.message ||
          data?.error ||
          data?.message ||
          `HTTP ${response.status}`;

        const browserRelay = await tryClientFormSubmitFallback(
          sanitizedEmail,
          sanitizedMessage,
          sanitizedTopic,
        );
        if (browserRelay.delivered) {
          handleSuccess();
        } else {
          setSubmitError(
            `Unable to dispatch automatically (${serverMsg}). Tap Open in Gmail or WhatsApp to send directly.`,
          );
        }
        return;
      }

      if (!data.deliveredViaEmail) {
        const browserRelay = await tryClientFormSubmitFallback(
          sanitizedEmail,
          sanitizedMessage,
          sanitizedTopic,
        );
        handleSuccess();
      } else {
        handleSuccess();
      }
    } catch (err) {
      const errDetail = err instanceof Error ? err.message : 'Network issue';
      const browserRelay = await tryClientFormSubmitFallback(
        sanitizedEmail,
        sanitizedMessage,
        sanitizedTopic,
      );
      if (browserRelay.delivered) {
        handleSuccess();
      } else {
        setSubmitError(
          `Mail service unreachable (${errDetail}). Tap Open in Gmail or WhatsApp to send directly.`,
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const socialItems = [
    {
      label: 'GitHub',
      handle: PROFILE.githubHandle,
      href: PROFILE.githubUrl,
      icon: Github,
      accent: 'saffron',
      desc: 'Source code for FairCart, FixOra & Java projects',
    },
    {
      label: 'LeetCode',
      handle: PROFILE.leetcodeHandle,
      href: PROFILE.leetcodeUrl,
      icon: Code2,
      accent: 'saffron',
      desc: 'Data Structures, Algorithms, Graphs, DP & SQL solutions',
    },
    {
      label: 'LinkedIn',
      handle: PROFILE.linkedinHandle,
      href: PROFILE.linkedinUrl,
      icon: Linkedin,
      accent: 'saffron',
      desc: 'Career updates, engineering milestones & connections',
    },
    {
      label: 'WhatsApp Chat',
      handle: PROFILE.whatsappDisplay,
      href: buildWhatsAppHref(),
      icon: WhatsAppLogo,
      accent: 'jade',
      desc: 'Tap to open a direct WhatsApp chat with Aditya',
    },
  ];

  const rawGmailHref = submitResult?.gmailComposeUrl || buildGmailComposeHref(form);
  const activeGmailHref = isSafeHref(rawGmailHref) ? rawGmailHref : buildGmailComposeHref(form);

  return (
    <section id="contact" className="scroll-mt-24 py-10 sm:py-14">
      <div className="mx-auto max-w-[1380px] 2xl:max-w-[1520px] px-4 sm:px-6 lg:px-8">
        {/* Web Presence + Attached WhatsApp Chat Card */}
        <div className="mb-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {socialItems.map((item) => {
            const Icon = item.icon;
            const isWhatsApp = item.accent === 'jade';
            return (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`group glass-surface-subtle flex flex-col justify-between rounded-2xl p-4 transition-colors ${
                  isWhatsApp
                    ? 'border-[#2ec4b6]/35 hover:border-[#2ec4b6]/70 hover:bg-[#2ec4b6]/[0.08]'
                    : 'hover:border-[#ff9f1c]/45'
                }`}
              >
                <div className="flex items-center justify-between">
                  <motion.span
                    whileHover={{ rotate: -8, scale: 1.12 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                      isWhatsApp
                        ? 'border-[#3ecf8e]/40 bg-[#3ecf8e]/15 text-[#3ecf8e] group-hover:bg-[#3ecf8e] group-hover:text-[#060919]'
                        : 'border-white/10 bg-white/5 text-[#22d3ee] group-hover:border-[#22d3ee]/45 group-hover:bg-[#22d3ee]/15'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.span>
                  <span className="font-mono text-xs text-slate-400 group-hover:text-[#f8fafc]">↗</span>
                </div>
                <div className="mt-3">
                  <h3 className="font-display text-base font-bold text-[#f8fafc]">{item.label}</h3>
                  <p
                    className={`mt-0.5 truncate font-mono text-xs ${
                      isWhatsApp ? 'text-[#3ecf8e]' : 'text-[#22d3ee]'
                    }`}
                  >
                    {item.handle}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{item.desc}</p>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Direct Gmail Inbox & WhatsApp Contact Hub */}
        <SpotlightCard className="p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Direct Contact Info */}
            <div className="flex flex-col justify-between lg:col-span-5">
              <div>
                <p className="font-mono text-xs font-semibold tracking-[0.14em] text-[#22d3ee]">
                  Direct Inbox · Gmail &amp; WhatsApp
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#f8fafc] sm:text-4xl">
                  Drop a message straight into{' '}
                  <span className="font-editorial text-gradient-aurora font-semibold">Aditya&apos;s</span>{' '}
                  inbox.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Enter your email ID, write your note below, and hit send—your message dispatches straight to{' '}
                  <span className="font-mono text-xs text-[#22d3ee]">{PROFILE.email}</span>. Or start an instant
                  chat on WhatsApp at{' '}
                  <span className="font-mono text-xs text-[#3ecf8e]">{PROFILE.whatsappDisplay}</span>.
                </p>

                <div className="mt-5 space-y-2.5">
                  {/* Direct WhatsApp Hyperlink Card */}
                  <motion.a
                    href={buildWhatsAppHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex min-h-[48px] w-full items-center justify-between rounded-xl border border-[#3ecf8e]/40 bg-[#3ecf8e]/12 px-4 py-2.5 text-left text-sm font-medium text-[#f8fafc] transition-colors hover:border-[#3ecf8e]/75 hover:bg-[#3ecf8e]/20"
                  >
                    <span className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3ecf8e] text-[#060919]">
                        <WhatsAppLogo className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-[#faf7f2]">
                          Chat on WhatsApp
                        </span>
                        <span className="block font-mono text-xs tabular-nums text-[#2ec4b6]">
                          {PROFILE.whatsappDisplay}
                        </span>
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-xs text-[#2ec4b6] shrink-0">
                      <span>Open Chat</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </motion.a>

                  {/* Copy Gmail Button */}
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="flex min-h-[44px] w-full items-center justify-between rounded-xl border border-white/12 bg-white/5 px-4 py-2 text-left text-sm font-medium text-[#faf7f2] transition-colors hover:border-[#ff9f1c]/50 hover:bg-white/10 cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <Mail className="h-4 w-4 shrink-0 text-[#ff9f1c]" />
                      <span className="truncate font-mono text-xs sm:text-sm">{PROFILE.email}</span>
                    </span>
                    <span className="ml-2 inline-flex items-center gap-1 font-mono text-xs text-[#2ec4b6] shrink-0">
                      {emailCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{emailCopied ? 'Copied' : 'Copy'}</span>
                    </span>
                  </button>

                  {/* Direct Phone Call Link */}
                  <a
                    href={PROFILE.phoneHref}
                    className="flex min-h-[44px] w-full items-center justify-between rounded-xl border border-white/12 bg-white/5 px-4 py-2 text-sm font-medium text-[#faf7f2] transition-colors hover:border-[#ff9f1c]/50 hover:bg-white/10"
                  >
                    <span className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 text-[#ff9f1c]" />
                      <span className="font-mono text-xs sm:text-sm tabular-nums">{PROFILE.phone}</span>
                    </span>
                    <span className="font-mono text-xs text-stone-400">Call Direct</span>
                  </a>
                </div>
              </div>

              <p className="mt-6 font-mono text-xs text-stone-400">
                Base: {PROFILE.location} · IST (UTC+5:30)
              </p>
            </div>

            {/* Right Vertical Inbox Stack: 1. Email ID -> 2. Message -> 3. Send */}
            <form onSubmit={handleFormSubmit} noValidate className="flex flex-col gap-3.5 lg:col-span-7">
              {/* Hidden honeypot field against automated spam bots */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="contact-website">Leave empty</label>
                <input
                  id="contact-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-1.5 flex items-center justify-between text-xs font-semibold text-stone-200"
                >
                  <span>Your Email ID</span>
                  {validation.fieldValidity.email && (
                    <span className="inline-flex items-center gap-1 font-mono text-[#2ec4b6]">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Valid email
                    </span>
                  )}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  maxLength={160}
                  autoComplete="email"
                  value={form.email}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, email: e.target.value }));
                    if (isSent) setIsSent(false);
                    if (submitError) setSubmitError(null);
                  }}
                  placeholder="you@company.com"
                  className={`min-h-[46px] w-full rounded-xl border bg-black/45 px-4 py-2.5 text-sm text-[#faf7f2] placeholder:text-stone-500 focus:outline-none transition-colors ${
                    validation.fieldValidity.email
                      ? 'border-[#2ec4b6]/65'
                      : touched.email && validation.errors.email
                        ? 'border-[#ff5d8f]/75'
                        : 'border-white/15 focus:border-[#ff9f1c]/75'
                  }`}
                />
                {touched.email && validation.errors.email && (
                  <p className="mt-1 text-xs text-[#ff5d8f]">{validation.errors.email}</p>
                )}
              </div>

              {/* Starter Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] text-stone-400">Quick starters:</span>
                {CONTACT_STARTERS.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => applyStarter(s)}
                    className="rounded-lg border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-stone-300 transition-colors hover:border-[#ff9f1c]/50 hover:text-[#ff9f1c] cursor-pointer"
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Message Field Directly Underneath Email */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 flex items-center justify-between text-xs font-semibold text-stone-200"
                >
                  <span>Your Message</span>
                  {validation.fieldValidity.message && (
                    <span className="inline-flex items-center gap-1 font-mono text-[#2ec4b6]">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Ready ({form.message.trim().length} chars)
                    </span>
                  )}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  maxLength={2000}
                  rows={4}
                  value={form.message}
                  onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, message: e.target.value }));
                    if (isSent) setIsSent(false);
                    if (submitError) setSubmitError(null);
                  }}
                  placeholder="Write your message for Aditya here — role details, project idea, or feedback..."
                  className={`w-full rounded-xl border bg-black/45 px-4 py-2.5 text-sm text-[#faf7f2] placeholder:text-stone-500 focus:outline-none transition-colors ${
                    validation.fieldValidity.message
                      ? 'border-[#2ec4b6]/65'
                      : touched.message && validation.errors.message
                        ? 'border-[#ff5d8f]/75'
                        : 'border-white/15 focus:border-[#ff9f1c]/75'
                  }`}
                />
                {touched.message && validation.errors.message && (
                  <p className="mt-1 text-xs text-[#ff5d8f]">{validation.errors.message}</p>
                )}
              </div>

              {/* Send Button Directly Underneath Message */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <motion.button
                  type="submit"
                  disabled={submitting || isSent}
                  whileHover={{ scale: submitting || isSent ? 1 : 1.03, y: submitting || isSent ? 0 : -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group inline-flex min-h-[46px] items-center gap-2.5 rounded-xl px-6 py-2.5 text-sm font-bold shadow-xl transition-all cursor-pointer ${
                    isSent
                      ? 'bg-gradient-to-r from-[#2ec4b6] to-[#10b981] text-[#060919] shadow-[#2ec4b6]/25'
                      : 'bg-gradient-to-r from-[#22d3ee] to-[#38bdf8] text-[#060919] shadow-[#22d3ee]/20 hover:brightness-110 disabled:opacity-60'
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending to Aditya&apos;s Gmail...</span>
                    </>
                  ) : isSent ? (
                    <>
                      <Check className="h-4 w-4 stroke-[3]" />
                      <span>Message Sent!</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </motion.button>

                {validation.isValid && (
                  <a
                    href={activeGmailHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-stone-200 transition-colors hover:border-[#ff9f1c]/55 hover:text-[#ff9f1c]"
                  >
                    <Mail className="h-4 w-4 text-[#ff9f1c]" />
                    <span>Open in Gmail</span>
                  </a>
                )}
              </div>

              {submitError && (
                <p role="alert" className="rounded-xl border border-[#ff5d8f]/40 bg-[#ff5d8f]/10 px-4 py-3 text-xs text-rose-200">
                  {submitError}
                </p>
              )}
            </form>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
};
