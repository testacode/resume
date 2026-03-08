import { describe, it, expect } from 'vitest';
import { formatDate } from './Experience';

describe('formatDate', () => {
  it('returns "Present" for null', () => {
    expect(formatDate(null)).toBe('Present');
  });

  it('formats a valid date string', () => {
    expect(formatDate('2023-06')).toBe('Jun 2023');
  });

  it('returns raw string for invalid date', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });
});
