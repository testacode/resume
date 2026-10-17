import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Hero } from './Hero';
import { resetStoreForTests } from './scenes/store';

const audio = { start: vi.fn().mockResolvedValue(true), stop: vi.fn(), setVolume: vi.fn(), setDuck: vi.fn(), setScene: vi.fn(), dispose: vi.fn() };
vi.mock('./scenes/oceanAudio', () => ({ createOceanAudio: () => audio }));
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
  localStorage.clear();
  resetStoreForTests();
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

describe('Hero — scene', () => {
  it('picks a random scene on the client and flags it on <html>', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    const { container } = render(<Hero data={personal} />);

    const hero = container.querySelector('section');
    expect(hero).toHaveAttribute('data-scene', 'shore');
    expect(document.documentElement.dataset.heroScene).toBe('shore');
    expect(screen.getByRole('button', { name: 'π scene settings' })).toBeInTheDocument();
  });

  it('forces the scene from ?scene= for this load without persisting it', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    window.history.replaceState({}, '', '/?scene=shore');
    const { container } = render(<Hero data={personal} />);
    expect(container.querySelector('section')).toHaveAttribute('data-scene', 'shore');
    expect(localStorage.getItem('hero:scene')).toBeNull();
    window.history.replaceState({}, '', '/');
  });

  it('honours a stored scene choice over random', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    localStorage.setItem('hero:scene', 'horizon');
    const { container } = render(<Hero data={personal} />);

    expect(container.querySelector('section')).toHaveAttribute('data-scene', 'horizon');
  });

  it('fades the sound with scroll over the hero height', () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] });
    const { container } = render(<Hero data={personal} />);
    const hero = container.querySelector('section') as HTMLElement;
    Object.defineProperty(hero, 'offsetHeight', { value: 800, configurable: true });

    Object.defineProperty(window, 'scrollY', { value: 400, configurable: true });
    fireEvent.scroll(window);
    act(() => { vi.advanceTimersByTime(32); });
    expect(audio.setDuck).toHaveBeenLastCalledWith(0.5);

    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    fireEvent.scroll(window);
    act(() => { vi.advanceTimersByTime(32); });
    expect(audio.setDuck).toHaveBeenLastCalledWith(1);
  });

  it('starts with sound on and persists a mute', () => {
    render(<Hero data={personal} />);
    const speaker = screen.getByRole('button', { name: 'Mute sea sound' });
    fireEvent.click(speaker);
    expect(screen.getByRole('button', { name: 'Play sea sound' })).toBeInTheDocument();
    expect(localStorage.getItem('hero:sound')).toBe('off');
  });

  it('switches scene from the panel and persists the choice', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const { container } = render(<Hero data={personal} />);
    expect(container.querySelector('section')).toHaveAttribute('data-scene', 'horizon');

    fireEvent.click(screen.getByRole('button', { name: 'π scene settings' }));
    fireEvent.click(screen.getByRole('button', { name: 'Shore' }));

    expect(container.querySelector('section')).toHaveAttribute('data-scene', 'shore');
    expect(localStorage.getItem('hero:scene')).toBe('shore');
  });
});
