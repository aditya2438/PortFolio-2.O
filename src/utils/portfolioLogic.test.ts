import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CERTIFICATIONS,
  CONTACT_STARTERS,
  EDUCATION,
  FIT_CRITERIA,
  FUN_TRUTHS,
  HERO_METRICS,
  HERO_MOODS,
  PROFILE,
  PROJECTS,
  SkillCategory,
  SKILLS,
} from '../data/portfolioData.ts';
import {
  buildGmailComposeHref,
  buildMailtoHref,
  buildWhatsAppHref,
  computeTeamFitResult,
  filterSkillsByCategory,
  getNextTruthIndex,
  isSafeHref,
  sanitizeUserText,
  validateDirectMessage,
} from './portfolioLogic.ts';

const CATEGORIES: SkillCategory[] = ['all', 'languages', 'backend', 'databases', 'tools'];

test('portfolioData integrity: all external URLs, assets, and section datasets are non-empty and safe', () => {
  assert.equal(PROFILE.email, 'adityachouhan2446@gmail.com');
  assert.equal(isSafeHref(PROFILE.githubUrl), true);
  assert.equal(isSafeHref(PROFILE.linkedinUrl), true);
  assert.equal(isSafeHref(PROFILE.leetcodeUrl), true);
  assert.equal(isSafeHref(PROFILE.resumeUrl), true);
  assert.equal(isSafeHref(PROFILE.photoUrl), true);
  assert.equal(isSafeHref(PROFILE.whatsappUrl), true);

  assert.ok(PROJECTS.length >= 3);
  for (const p of PROJECTS) {
    assert.ok(p.title.length > 0);
    assert.ok(p.stages.length >= 3);
    assert.ok(p.highlights.length >= 3);
    if (p.repoUrl) assert.equal(isSafeHref(p.repoUrl), true);
    if (p.liveUrl) assert.equal(isSafeHref(p.liveUrl), true);
  }

  assert.equal(SKILLS.length, 20);
  assert.ok(EDUCATION.length >= 3);
  assert.ok(CERTIFICATIONS.length >= 3);
  assert.equal(HERO_MOODS.length, 3);
  assert.equal(HERO_METRICS.length, 4);
  assert.ok(FUN_TRUTHS.length >= 5);
  assert.ok(CONTACT_STARTERS.length >= 3);
});

test('filterSkillsByCategory returns all skills or exact category matches', () => {
  const all = filterSkillsByCategory(SKILLS, 'all');
  assert.equal(all.length, SKILLS.length);

  for (const cat of CATEGORIES) {
    const subset = filterSkillsByCategory(SKILLS, cat);
    assert.ok(subset.length > 0, `Category ${cat} should not be empty`);
    if (cat !== 'all') {
      assert.ok(subset.every((s) => s.category === cat));
    }
  }
});

test('getNextTruthIndex wraps cleanly around array length and handles edge lengths', () => {
  assert.equal(getNextTruthIndex(0, 6), 1);
  assert.equal(getNextTruthIndex(5, 6), 0);
  assert.equal(getNextTruthIndex(0, 1), 0);
  assert.equal(getNextTruthIndex(0, 0), 0);
});

test('computeTeamFitResult transitions accurately across all 4 verdict tiers (0%, low, mid, high)', () => {
  const empty = computeTeamFitResult(FIT_CRITERIA, []);
  assert.equal(empty.score, 0);
  assert.match(empty.headline, /Pick what matters/i);

  const low = computeTeamFitResult(FIT_CRITERIA, [FIT_CRITERIA[5].id]); // 8 pts out of 100
  assert.ok(low.score > 0 && low.score < 45);
  assert.match(low.headline, /Strong Backend Core/i);

  const mid = computeTeamFitResult(
    FIT_CRITERIA,
    FIT_CRITERIA.slice(0, 3).map((c) => c.id), // 66 pts
  );
  assert.ok(mid.score >= 45 && mid.score < 85);
  assert.match(mid.headline, /High-Impact Engineering Match/i);

  const full = computeTeamFitResult(
    FIT_CRITERIA,
    FIT_CRITERIA.map((c) => c.id),
  );
  assert.equal(full.score, 100);
  assert.match(full.headline, /100% Certified/i);
});

test('validateDirectMessage validates boundary cases (email TLD, min 5 chars, whitespace, XSS)', () => {
  const blank = validateDirectMessage({ email: '   ', message: '    ' });
  assert.equal(blank.isValid, false);
  assert.equal(blank.fieldValidity.email, false);
  assert.equal(blank.fieldValidity.message, false);

  const shortMsg = validateDirectMessage({ email: 'recruiter@acme.io', message: 'abcd' });
  assert.equal(shortMsg.isValid, false);
  assert.equal(shortMsg.fieldValidity.email, true);
  assert.equal(shortMsg.fieldValidity.message, false);

  const exactMin = validateDirectMessage({ email: 'recruiter@acme.io', message: 'Hello' });
  assert.equal(exactMin.isValid, true);

  const emptyTags = validateDirectMessage({
    email: 'recruiter@acme.io',
    message: '<img src=x onerror=alert(1)>',
  });
  assert.equal(emptyTags.isValid, false);
});

test('buildMailtoHref, buildGmailComposeHref, buildWhatsAppHref preserve recipient and strip dangerous injection', () => {
  const mailto = buildMailtoHref({
    email: 'hiring@company.com',
    message: '<script>evil</script>Loved FairCart!',
    topic: 'Backend\r\nBcc:attacker@evil.com',
  });
  assert.ok(mailto.startsWith('mailto:adityachouhan2446@gmail.com?'));
  assert.ok(!decodeURIComponent(mailto).includes('<script>'));
  assert.ok(!decodeURIComponent(mailto).includes('\r'));

  const gmail = buildGmailComposeHref({
    email: 'hiring@company.com',
    message: 'Loved FairCart!',
    topic: 'Backend Role',
  });
  assert.ok(gmail.includes('https://mail.google.com/mail/'));
  assert.ok(gmail.includes('to=adityachouhan2446@gmail.com'));

  const waDefault = buildWhatsAppHref();
  assert.ok(waDefault.startsWith('https://wa.me/917880209425?text='));

  const waCustom = buildWhatsAppHref('<b>Hi Aditya</b> javascript:bad()');
  assert.ok(!decodeURIComponent(waCustom).includes('<b>'));
  assert.ok(!decodeURIComponent(waCustom).includes('javascript:'));
});

test('sanitizeUserText and isSafeHref block XSS scripts, mixed-case protocols, and null bytes', () => {
  const dirty = '<script>alert(1)</script>JaVaScRiPt:evil() DATA:text/html VbScRiPt:x Hello\0World';
  const clean = sanitizeUserText(dirty, 200);
  assert.ok(!clean.includes('<script>'));
  assert.ok(!clean.toLowerCase().includes('javascript:'));
  assert.ok(!clean.toLowerCase().includes('data:'));
  assert.ok(!clean.toLowerCase().includes('vbscript:'));
  assert.ok(!clean.includes('\0'));
  assert.ok(clean.includes('HelloWorld'));

  assert.equal(isSafeHref('https://wa.me/917880209425'), true);
  assert.equal(isSafeHref('http://localhost:3000'), true);
  assert.equal(isSafeHref('mailto:adityachouhan2446@gmail.com'), true);
  assert.equal(isSafeHref('tel:+917880209425'), true);
  assert.equal(isSafeHref('/assets/resume.pdf'), true);
  assert.equal(isSafeHref('#contact'), true);
  assert.equal(isSafeHref('   JAVASCRIPT:alert(1)'), false);
  assert.equal(isSafeHref('data:text/html,<script>'), false);
  assert.equal(isSafeHref('vbscript:msgbox(1)'), false);
  assert.equal(isSafeHref(''), false);
});
