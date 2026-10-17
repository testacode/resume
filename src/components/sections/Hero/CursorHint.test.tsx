import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { CursorHint } from './CursorHint';

function mockPointer(fine: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (q: string) => ({ matches: q.includes('pointer: fine') ? fine : false, addEventListener() {}, removeEventListener() {} }),
  });
}

describe('CursorHint', () => {
  beforeEach(() => mockPointer(true));

  it('is present but never shown when inactive from the start', () => {
    const { container } = render(<CursorHint active={false} />);
    fireEvent.pointerMove(window, { clientX: 100, clientY: 50 });
    const hint = container.firstElementChild as HTMLElement;
    expect(hint.className).not.toMatch(/visible/);
    expect(hint.firstElementChild?.className).toMatch(/leaving/);
  });

  it('renders the two lines, hidden from assistive tech, and becomes visible on pointer move', () => {
    const { container } = render(<CursorHint active />);
    const hint = container.firstElementChild as HTMLElement;
    expect(hint).toHaveAttribute('aria-hidden', 'true');
    expect(hint).toHaveTextContent('♪ click');
    expect(hint).toHaveTextContent('to listen');
    expect(hint.className).not.toMatch(/visible/);

    fireEvent.pointerMove(window, { clientX: 100, clientY: 50 });
    expect(hint.className).toMatch(/visible/);
  });

  it('floats away on deactivation', () => {
    const { container, rerender } = render(<CursorHint active />);
    const label = container.querySelector('[class*=label]') as HTMLElement;
    expect(label.className).not.toMatch(/leaving/);
    rerender(<CursorHint active={false} />);
    expect(label.className).toMatch(/leaving/);
  });

  it('stays hidden on coarse pointers', () => {
    mockPointer(false);
    const { container } = render(<CursorHint active />);
    fireEvent.pointerMove(window, { clientX: 100, clientY: 50 });
    expect((container.firstElementChild as HTMLElement).className).not.toMatch(/visible/);
  });
});
