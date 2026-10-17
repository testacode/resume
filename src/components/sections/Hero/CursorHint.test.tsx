import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CursorHint } from './CursorHint';

function mockPointer(fine: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (q: string) => ({ matches: q.includes('pointer: fine') ? fine : false, addEventListener() {}, removeEventListener() {} }),
  });
}

describe('CursorHint', () => {
  beforeEach(() => mockPointer(true));

  it('renders nothing when inactive', () => {
    render(<CursorHint active={false} />);
    expect(screen.queryByText('to listen')).not.toBeInTheDocument();
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

  it('stays hidden on coarse pointers', () => {
    mockPointer(false);
    const { container } = render(<CursorHint active />);
    fireEvent.pointerMove(window, { clientX: 100, clientY: 50 });
    expect((container.firstElementChild as HTMLElement).className).not.toMatch(/visible/);
  });
});
