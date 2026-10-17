import { describe, it, expect } from 'vitest';
import { buildLlmsTxt } from './llms';
import { resumeData } from '@/data/resume';

describe('buildLlmsTxt', () => {
  const txt = buildLlmsTxt();

  it('uses the current title and bio from resume data', () => {
    expect(txt).toContain(resumeData.personal.title);
    expect(txt).toContain(resumeData.personal.bio);
  });

  it('lists every experience, current role as Present', () => {
    resumeData.experience.forEach((e) => expect(txt).toContain(`${e.title} at ${e.company}`));
    expect(txt).toMatch(/\(\d{4} - Present\)/);
  });

  it('only lists live projects', () => {
    resumeData.projects
      .filter((p) => p.status === 'coming-soon')
      .forEach((p) => expect(txt).not.toContain(`- ${p.name}:`));
  });
});
