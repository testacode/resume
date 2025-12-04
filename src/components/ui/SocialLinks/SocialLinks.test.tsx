import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SocialLinks } from './SocialLinks';
import type { SocialLink } from '@/types/resume';

const mockLinks: SocialLink[] = [
  { name: 'LinkedIn', url: 'https://linkedin.com/in/test', icon: 'linkedin', enabled: true },
  { name: 'GitHub', url: 'https://github.com/test', icon: 'github', enabled: true },
  { name: 'GitLab', url: 'https://gitlab.com/test', icon: 'gitlab', enabled: false },
];

describe('SocialLinks', () => {
  it('renders enabled links only', () => {
    render(<SocialLinks links={mockLinks} />);

    expect(screen.getByLabelText('Visit my LinkedIn profile')).toBeInTheDocument();
    expect(screen.getByLabelText('Visit my GitHub profile')).toBeInTheDocument();
    expect(screen.queryByLabelText('Visit my GitLab profile')).not.toBeInTheDocument();
  });

  it('renders links with correct href and attributes', () => {
    render(<SocialLinks links={mockLinks} />);

    const linkedinLink = screen.getByLabelText('Visit my LinkedIn profile');
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/test');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders with aria-label for accessibility', () => {
    render(<SocialLinks links={mockLinks} />);

    expect(screen.getByRole('list', { name: 'Social media links' })).toBeInTheDocument();
  });

  it('renders nothing when all links are disabled', () => {
    const disabledLinks = mockLinks.map((link) => ({ ...link, enabled: false }));
    render(<SocialLinks links={disabledLinks} />);

    const list = screen.getByRole('list', { name: 'Social media links' });
    expect(list.children).toHaveLength(0);
  });
});
