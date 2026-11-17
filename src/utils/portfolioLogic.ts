import { FitCriterion, SkillCategory, SkillItem } from '../data/portfolioData';

export function filterSkillsByCategory(skills: SkillItem[], category: SkillCategory): SkillItem[] {
  if (category === 'all') return skills;
  return skills.filter((s) => s.category === category);
}

export function getNextTruthIndex(current: number, total: number): number {
  if (total <= 1) return 0;
  return (current + 1) % total;
}

export interface TeamFitResult {
  score: number;
  verdict: string;
  headline: string;
}

export function computeTeamFitResult(
  criteria: FitCriterion[],
  selectedIds: string[],
): TeamFitResult {
  const maxPoints = criteria.reduce((sum, c) => sum + c.points, 0) || 100;
  const earned = criteria
    .filter((c) => selectedIds.includes(c.id))
    .reduce((sum, c) => sum + c.points, 0);

  const score = Math.min(100, Math.round((earned / maxPoints) * 100));

  if (score === 0) {
    return {
      score: 0,
      headline: 'Pick what matters to your team',
      verdict: 'Toggle any priorities on the left to see how Aditya matches your engineering stack.',
    };
  }
  if (score < 45) {
    return {
      score,
      headline: 'Strong Backend Core',
      verdict: 'Fast learner ready to ramp up on your custom stack with solid Java 21, SQL & clean API fundamentals.',
    };
  }
  if (score < 85) {
    return {
      score,
      headline: 'High-Impact Engineering Match',
      verdict: 'Hands-on experience across Spring Boot 3.3, Redis, Kafka & normalized schemas—ready to ship from week one.',
    };
  }
  return {
    score,
    headline: '100% Certified Chai-Powered Match',
    verdict: 'You just described FairCart & FixOra word-for-word. Send a quick message below or tap WhatsApp!',
  };
}

/**
 * Sanitizes client input against XSS payloads, control bytes, and injection fragments.
 */
export function sanitizeUserText(raw: string, maxLen = 2000, preserveNewlines = false): string {
  if (typeof raw !== 'string') return '';
  let clean = raw
    .replace(/\0/g, '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/javascript:|data:|vbscript:/gi, '');

  if (!preserveNewlines) {
    clean = clean.replace(/[\r\n\t]+/g, ' ');
  } else {
    clean = clean.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  }
  return clean.trim().slice(0, maxLen);
}

/**
 * Ensures outbound URLs only use safe protocols (blocks javascript:, data:, vbscript: XSS links).
 */
export function isSafeHref(url: string): boolean {
  const trimmed = (url || '').trim().toLowerCase();
  return (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#')
  );
}

export interface DirectMessageInput {
  email: string;
  message: string;
  topic?: string;
}

export interface DirectMessageValidation {
  isValid: boolean;
  errors: {
    email?: string;
    message?: string;
  };
  fieldValidity: {
    email: boolean;
    message: boolean;
  };
}

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

export function validateDirectMessage(input: DirectMessageInput): DirectMessageValidation {
  const errors: { email?: string; message?: string } = {};
  const trimmedEmail = sanitizeUserText(input.email, 160);
  const trimmedMsg = sanitizeUserText(input.message, 2000, true);

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address (e.g. you@company.com).';
  }
  if (trimmedMsg.length < 5) {
    errors.message = 'Please write at least 5 characters so Aditya knows how to help.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    fieldValidity: {
      email: EMAIL_REGEX.test(trimmedEmail),
      message: trimmedMsg.length >= 5,
    },
  };
}

export function buildMailtoHref(input: DirectMessageInput): string {
  const topic = sanitizeUserText(input.topic || 'Portfolio Inquiry', 80) || 'Portfolio Inquiry';
  const email = sanitizeUserText(input.email, 160);
  const message = sanitizeUserText(input.message, 2000, true);
  const subject = encodeURIComponent(`[${topic}] Message for Aditya Chouhan — from ${email}`);
  const body = encodeURIComponent(`Hi Aditya,\n\n${message}\n\nReply to: ${email}`);
  return `mailto:adityachouhan2446@gmail.com?subject=${subject}&body=${body}`;
}

export function buildGmailComposeHref(input: DirectMessageInput): string {
  const topic = sanitizeUserText(input.topic || 'Portfolio Inquiry', 80) || 'Portfolio Inquiry';
  const email = sanitizeUserText(input.email, 160);
  const message = sanitizeUserText(input.message, 2000, true);
  const subject = encodeURIComponent(`[${topic}] Message for Aditya Chouhan — from ${email}`);
  const body = encodeURIComponent(`Hi Aditya,\n\n${message}\n\nReply to: ${email}`);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=adityachouhan2446@gmail.com&su=${subject}&body=${body}`;
}

export function buildWhatsAppHref(customMessage?: string): string {
  const text = encodeURIComponent(
    sanitizeUserText(
      customMessage || 'Hi Aditya! I visited your portfolio and would love to connect.',
      400,
    ),
  );
  return `https://wa.me/917880209425?text=${text}`;
}
