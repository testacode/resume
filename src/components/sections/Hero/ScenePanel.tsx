'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import type { ControlSpec, SceneChoice, SceneConfig, SceneDef } from './scenes/types';
import { STYLE_CONTROLS } from './scenes/shared';
import styles from './ScenePanel.module.css';

type Props = {
  choice: SceneChoice;
  onChoice: (choice: SceneChoice) => void;
  scene: SceneDef;
  config: SceneConfig;
  onChange: (config: SceneConfig) => void;
  onReset: () => void;
};

const CHOICES: ReadonlyArray<[SceneChoice, string]> = [['random', 'Random'], ['horizon', 'Horizon'], ['shore', 'Shore']];

function groupControls(scene: SceneDef): Map<string, ControlSpec[]> {
  const groups = new Map<string, ControlSpec[]>();
  for (const spec of [...scene.controls, ...STYLE_CONTROLS]) {
    groups.set(spec.group, [...(groups.get(spec.group) ?? []), spec]);
  }
  return groups;
}

function Control({ spec, value, onChange }: { spec: ControlSpec; value: number | string; onChange: (v: number | string) => void }) {
  const id = useId();
  if (spec.kind === 'check') {
    return (
      <div className={`${styles.row} ${styles.rowInline}`}>
        <label htmlFor={id}>{spec.label}</label>
        <input id={id} type="checkbox" checked={value === 1} onChange={(e) => onChange(e.target.checked ? 1 : 0)} />
      </div>
    );
  }
  if (spec.kind === 'color') {
    return (
      <div className={`${styles.row} ${styles.rowInline}`}>
        <label htmlFor={id}>{spec.label}</label>
        <input id={id} type="color" value={String(value)} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  if (spec.kind === 'select') {
    return (
      <div className={`${styles.row} ${styles.rowInline}`}>
        <label htmlFor={id}>{spec.label}</label>
        <select id={id} value={Number(value)} onChange={(e) => onChange(Number(e.target.value))}>
          {spec.options.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
        </select>
      </div>
    );
  }
  return (
    <div className={styles.row}>
      <label htmlFor={id}>{spec.label}</label>
      <div className={styles.range}>
        <input id={id} type="range" min={spec.min} max={spec.max} step={spec.step} value={Number(value)} onChange={(e) => onChange(Number(e.target.value))} />
        <output htmlFor={id}>{value}</output>
      </div>
    </div>
  );
}

export function ScenePanel({ choice, onChoice, scene, config, onChange, onReset }: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const applyPreset = (name: string) => onChange({ ...scene.defaults, ...scene.presets[name] });
  const set = (key: string, value: number | string) => onChange({ ...config, [key]: value });

  return (
    <div ref={rootRef} className={styles.root}>
      {open && (
        <div ref={panelRef} id={panelId} className={styles.panel} role="dialog" aria-label="Scene settings">
          <section className={styles.section}>
            <h3 className={styles.heading}>Scene</h3>
            <div className={styles.chips}>
              {CHOICES.map(([value, label]) => (
                <button key={value} type="button" className={styles.chip} aria-pressed={choice === value} onClick={() => onChoice(value)}>
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.heading}>{scene.label} presets</h3>
            <div className={styles.chips}>
              {Object.keys(scene.presets).map((name) => (
                <button key={name} type="button" className={styles.chip} onClick={() => applyPreset(name)}>
                  {name}
                </button>
              ))}
            </div>
          </section>

          {[...groupControls(scene)].map(([group, specs], index) => (
            <details key={group} className={styles.group} open={index === 0}>
              <summary className={styles.summary}>{group}</summary>
              {specs.map((spec) => (
                <Control key={spec.key} spec={spec} value={config[spec.key]} onChange={(v) => set(spec.key, v)} />
              ))}
            </details>
          ))}

          <button type="button" className={styles.reset} onClick={onReset}>
            Reset {scene.label.toLowerCase()}
          </button>
        </div>
      )}
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-label="Scene settings"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
      >
        π
      </button>
    </div>
  );
}
