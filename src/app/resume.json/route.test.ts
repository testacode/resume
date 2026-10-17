import { describe, it, expect } from 'vitest';
import { GET, dynamic } from './route';
import { resumeData } from '@/data/resume';

describe('GET /resume.json', () => {
  it('is prerendered at build time', () => {
    expect(dynamic).toBe('force-static');
  });

  it('serves the resume data as JSON', async () => {
    const res = GET();
    expect(res.headers.get('content-type')).toContain('application/json');
    expect(await res.json()).toEqual(resumeData);
  });
});
