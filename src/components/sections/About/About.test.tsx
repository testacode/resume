import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { About } from './About';
import type { PersonalInfo } from '@/types/resume';

beforeAll(() => {
  // JSDOM does not implement IntersectionObserver, which Motion's whileInView uses.
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
});

const baseData: PersonalInfo = {
  name: 'Carlos Monti',
  title: 'Senior Front End Developer',
  tagline: 'Building polished web experiences',
  bio: 'A passionate developer.',
  address: { city: 'Buenos Aires', country: 'Argentina' },
  resumePdfUrl: 'https://example.com/resume.pdf',
  resumeDocxUrl: 'https://example.com/resume.docx',
  social: [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/carlosmonti/',
      icon: 'linkedin',
      enabled: true,
    },
  ],
};

describe('About — LinkedIn CTA', () => {
  it('renders "Get in touch" link with the enabled LinkedIn URL', () => {
    render(<About data={baseData} />);

    const link = screen.getByRole('link', { name: /get in touch with me on linkedin/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/carlosmonti/');
  });

  it('omits the link when no enabled linkedin entry exists', () => {
    const data: PersonalInfo = {
      ...baseData,
      social: [{ name: 'LinkedIn', url: 'https://www.linkedin.com/in/carlosmonti/', icon: 'linkedin', enabled: false }],
    };
    render(<About data={data} />);

    expect(screen.queryByRole('link', { name: /get in touch with me on linkedin/i })).not.toBeInTheDocument();
  });

  it('link has target="_blank" and rel containing "noopener"', () => {
    render(<About data={baseData} />);

    const link = screen.getByRole('link', { name: /get in touch with me on linkedin/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });
});
