import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Hero } from './Hero';
import type { PersonalInfo } from '@/types/resume';

const personal: PersonalInfo = {
  name: 'Carlos Monti',
  title: 'Frontend Engineer',
  tagline: 'Building for the web.',
  bio: 'Bio.',
  address: { city: 'Buenos Aires', country: 'Argentina' },
  resumePdfUrl: '/resume.pdf',
  resumeDocxUrl: '/resume.docx',
  social: [
    { name: 'GitHub', url: 'https://github.com/testacode', icon: 'github', enabled: true },
  ],
};

const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined);

beforeEach(() => {
  writeText.mockClear();
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Hero — npx xmontc', () => {
  it('renders the npx xmontc terminal line', () => {
    render(<Hero data={personal} />);

    const button = screen.getByRole('button', { name: 'Copy npx xmontc to clipboard' });
    expect(button).toHaveTextContent('npx xmontc');
    expect(button).toHaveTextContent('charly@portfolio:~$');
  });

  it('copies the command to the clipboard and shows feedback on click', async () => {
    render(<Hero data={personal} />);

    fireEvent.click(screen.getByRole('button', { name: 'Copy npx xmontc to clipboard' }));

    expect(await screen.findByText('copied to clipboard')).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledExactlyOnceWith('npx xmontc');
  });

  it('clears the copied feedback after 2s', async () => {
    vi.useFakeTimers();
    render(<Hero data={personal} />);

    fireEvent.click(screen.getByRole('button', { name: 'Copy npx xmontc to clipboard' }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(screen.getByText('copied to clipboard')).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });
    expect(screen.queryByText('copied to clipboard')).not.toBeInTheDocument();
  });
});
