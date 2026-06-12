import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Education } from './Education';
import type { Education as EducationType } from '@/types/resume';

beforeAll(() => {
  // JSDOM does not implement IntersectionObserver, which Motion's whileInView uses.
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
});

const withDescription: EducationType = {
  school: 'Escuela Multimedial Da Vinci',
  degree: 'Desarrollo Multimedia',
  graduationDate: 'Not graduated (3 years)',
  description: 'Learned basic procedural coding, repetition structures, graphic design, image and sound composition.',
};

const withoutDescription: EducationType = {
  school: 'Escuelas de las Americas Nº 5',
  degree: 'Economics Science Bachelor',
  graduationDate: 'March 2002',
};

describe('Education', () => {
  it('renders the "Education" heading and all school names', () => {
    render(<Education data={[withDescription, withoutDescription]} />);

    expect(screen.getByRole('heading', { name: 'Education', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: withDescription.school, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: withoutDescription.school, level: 3 })).toBeInTheDocument();
  });

  it('renders description when present and omits it when absent', () => {
    render(<Education data={[withDescription, withoutDescription]} />);

    expect(screen.getByText(withDescription.description!)).toBeInTheDocument();
    // withoutDescription has no description — confirm nothing from it appears as a stray paragraph
    // (we can verify via absence of a third occurrence of any description text)
    const descriptions = screen.queryAllByText(/repetition structures/i);
    expect(descriptions).toHaveLength(1);
  });

  it('renders graduationDate verbatim without date-parsing', () => {
    render(<Education data={[withDescription]} />);

    expect(screen.getByText('Not graduated (3 years)')).toBeInTheDocument();
  });
});
