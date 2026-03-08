import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { useFocusTrap } from './useFocusTrap';

function createContainer(): HTMLDivElement {
  const container = document.createElement('div');

  const link1 = document.createElement('a');
  link1.href = '#one';
  link1.textContent = 'Link 1';

  const button = document.createElement('button');
  button.textContent = 'Button';

  const link2 = document.createElement('a');
  link2.href = '#two';
  link2.textContent = 'Link 2';

  container.append(link1, button, link2);
  document.body.appendChild(container);
  return container;
}

describe('useFocusTrap', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = createContainer();
  });

  afterEach(() => {
    container.remove();
  });

  it('focuses first focusable element on activate', () => {
    const firstLink = container.querySelector('a') as HTMLAnchorElement;

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container);
      useFocusTrap(ref, true);
    });

    expect(document.activeElement).toBe(firstLink);
  });

  it('wraps focus from last to first on Tab', () => {
    const links = container.querySelectorAll('a');
    const firstLink = links[0] as HTMLAnchorElement;
    const lastLink = links[1] as HTMLAnchorElement;

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container);
      useFocusTrap(ref, true);
    });

    lastLink.focus();
    expect(document.activeElement).toBe(lastLink);

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    vi.spyOn(tabEvent, 'preventDefault');
    document.dispatchEvent(tabEvent);

    expect(tabEvent.preventDefault).toHaveBeenCalled();
    expect(document.activeElement).toBe(firstLink);
  });

  it('wraps focus from first to last on Shift+Tab', () => {
    const links = container.querySelectorAll('a');
    const firstLink = links[0] as HTMLAnchorElement;
    const lastLink = links[1] as HTMLAnchorElement;

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container);
      useFocusTrap(ref, true);
    });

    firstLink.focus();
    expect(document.activeElement).toBe(firstLink);

    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
    });
    vi.spyOn(shiftTabEvent, 'preventDefault');
    document.dispatchEvent(shiftTabEvent);

    expect(shiftTabEvent.preventDefault).toHaveBeenCalled();
    expect(document.activeElement).toBe(lastLink);
  });

  it('restores focus to previous element on deactivate', () => {
    const externalButton = document.createElement('button');
    externalButton.textContent = 'External';
    document.body.appendChild(externalButton);
    externalButton.focus();

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(container);
      useFocusTrap(ref, true);
    });

    expect(document.activeElement).not.toBe(externalButton);

    unmount();

    expect(document.activeElement).toBe(externalButton);
    externalButton.remove();
  });
});
