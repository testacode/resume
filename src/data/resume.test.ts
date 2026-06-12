import { describe, it, expect } from 'vitest';
import { resumeData } from './resume';

describe('resumeData', () => {
  describe('personal', () => {
    it('has required personal information', () => {
      expect(resumeData.personal.name).toBeDefined();
      expect(resumeData.personal.title).toBeDefined();
      expect(resumeData.personal.address).toBeDefined();
      expect(resumeData.personal.address.city).toBeDefined();
    });

    it('has valid social links', () => {
      expect(resumeData.personal.social).toBeInstanceOf(Array);
      expect(resumeData.personal.social.length).toBeGreaterThan(0);

      resumeData.personal.social.forEach((link) => {
        expect(link.name).toBeDefined();
        expect(link.url).toBeDefined();
        expect(link.icon).toBeDefined();
        expect(typeof link.enabled).toBe('boolean');
      });
    });
  });

  describe('experience', () => {
    it('has work experience entries', () => {
      expect(resumeData.experience).toBeInstanceOf(Array);
      expect(resumeData.experience.length).toBeGreaterThan(0);
    });

    it('each experience has required fields', () => {
      resumeData.experience.forEach((exp) => {
        expect(exp.id).toBeDefined();
        expect(exp.company).toBeDefined();
        expect(exp.title).toBeDefined();
        expect(exp.startDate).toBeDefined();
        expect(exp.technologies).toBeInstanceOf(Array);
        expect(exp.description).toBeDefined();
      });
    });

    it('experiences are in chronological order (most recent first)', () => {
      const dates = resumeData.experience.map((exp) => new Date(exp.startDate));
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i].getTime()).toBeGreaterThanOrEqual(dates[i + 1].getTime());
      }
    });
  });
});
