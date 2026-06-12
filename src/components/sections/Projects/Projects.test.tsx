import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Projects } from './Projects';
import type { Project } from '@/types/resume';

beforeAll(() => {
  // JSDOM does not implement IntersectionObserver, which Motion's whileInView uses.
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
});

const liveProject: Project = {
  id: 'live-project',
  name: 'Live Project',
  description: 'A live project.',
  url: 'https://example.com',
  technologies: ['React', 'TypeScript'],
  status: 'live',
};

const comingSoonProject: Project = {
  id: 'coming-soon-project',
  name: 'Coming Soon Project',
  description: 'A project in progress.',
  technologies: ['Next.js'],
  status: 'coming-soon',
};

describe('Projects — status dots', () => {
  it("live project's dot carries the live class", () => {
    render(<Projects data={[liveProject]} />);

    // The dot is the only aria-hidden span adjacent to the project name
    const dots = document.querySelectorAll('[aria-hidden="true"]');
    const liveDot = Array.from(dots).find((el) =>
      el.className.includes('statusDot')
    );

    expect(liveDot).toBeDefined();
    expect(liveDot!.className).toMatch(/live/);
    expect(liveDot!.className).not.toMatch(/comingSoon/);
  });

  it("coming-soon project's dot carries the comingSoon class and the text label renders", () => {
    render(<Projects data={[comingSoonProject]} />);

    const dots = document.querySelectorAll('[aria-hidden="true"]');
    const dot = Array.from(dots).find((el) =>
      el.className.includes('statusDot')
    );

    expect(dot).toBeDefined();
    expect(dot!.className).toMatch(/comingSoon/);
    expect(dot!.className).not.toMatch(/\blive\b/);
    expect(screen.getByText('coming soon')).toBeInTheDocument();
  });

  it('status dot is aria-hidden', () => {
    render(<Projects data={[liveProject, comingSoonProject]} />);

    const dots = document.querySelectorAll('[aria-hidden="true"]');
    const statusDots = Array.from(dots).filter((el) =>
      el.className.includes('statusDot')
    );

    expect(statusDots).toHaveLength(2);
    statusDots.forEach((dot) => {
      expect(dot).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
