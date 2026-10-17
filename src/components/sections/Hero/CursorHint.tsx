'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CursorHint.module.css';

type Props = {
  /** Shown while the sea sound is waiting for the first click. */
  active: boolean;
  lines?: readonly [string, string];
};

const OFFSET_X = 18;
const OFFSET_Y = 10;
const LAG = 0.12;

// Two-line label trailing the pointer (lerp follow). Pointer devices only; no lag under
// reduced motion. Purely decorative: aria-hidden, no pointer events.
export function CursorHint({ active, lines = ['♪ click', 'to listen'] }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia?.('(pointer: fine)').matches ?? false;
    if (!active || !fine) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const lag = reduced ? 1 : LAG;
    let target: { x: number; y: number } | null = null;
    let pos = { x: 0, y: 0 };
    let raf = 0;

    const frame = () => {
      raf = 0;
      if (!target || !ref.current) return;
      pos = { x: pos.x + (target.x - pos.x) * lag, y: pos.y + (target.y - pos.y) * lag };
      ref.current.style.transform = `translate(${pos.x + OFFSET_X}px, ${pos.y + OFFSET_Y}px)`;
      if (Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.3) raf = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => {
      const first = target === null;
      target = { x: e.clientX, y: e.clientY };
      if (first) { pos = { ...target }; setVisible(true); }
      if (!raf) raf = requestAnimationFrame(frame);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      setVisible(false);
    };
  }, [active]);

  if (!active) return null;
  return (
    <div ref={ref} className={`${styles.hint} ${visible ? styles.visible : ''}`} aria-hidden="true">
      <span>{lines[0]}</span>
      <span>{lines[1]}</span>
    </div>
  );
}
