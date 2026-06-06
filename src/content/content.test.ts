import { describe, it, expect } from 'vitest';
import { content } from './content';

describe('content config', () => {
  it('has the correct name and positioning', () => {
    expect(content.name).toBe('Anton Karmanov');
    expect(content.positioning).toBeTruthy();
    expect(content.positioning).toMatch(/Senior Full-Stack/);
  });

  it('exposes exactly 4 experience entries, newest-first (EXANTE first, Wow last)', () => {
    expect(content.experience).toHaveLength(4);
    expect(content.experience[0].company).toMatch(/EXANTE/);
    expect(content.experience[content.experience.length - 1].company).toMatch(/Wow/i);
  });

  it('gives every experience entry the full set of timeline fields', () => {
    for (const entry of content.experience) {
      expect(entry.period).toBeTruthy();
      expect(entry.company).toBeTruthy();
      expect(entry.role).toBeTruthy();
      expect(entry.location).toBeTruthy();
      expect(entry.summary).toBeTruthy();
      expect(Array.isArray(entry.bullets)).toBe(true);
      expect(entry.bullets.length).toBeGreaterThan(0);
    }
  });

  it('has a non-empty projects list, each with a repo and title', () => {
    expect(content.projects.length).toBeGreaterThan(0);
    for (const project of content.projects) {
      expect(project.title).toBeTruthy();
      expect(project.repo).toBeTruthy();
    }
  });

  it('includes the its.events project', () => {
    const titles = content.projects.map((p) => p.title);
    expect(titles.some((t) => /its\.events/i.test(t))).toBe(true);
  });

  it('sets the availability and GitHub flags', () => {
    expect(typeof content.flags.available).toBe('boolean');
    expect(content.flags.available).toBe(true);
    expect(content.flags.githubUser).toBe('HawkeyePierce89');
    expect(content.flags.heroVariant).toBe('blob');
  });

  it('links Telegram via the correct handle', () => {
    const telegram = content.contact.socials.find((s) => /telegram/i.test(s.label));
    expect(telegram).toBeDefined();
    expect(telegram?.href).toBe('https://t.me/HawkeyePierce89');
  });

  it('provides three About stats for the 14/7/4 row', () => {
    expect(content.about.stats).toHaveLength(3);
    expect(content.about.stats.map((s) => s.value)).toEqual(['14', '7', '4']);
  });
});
