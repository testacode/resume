import type { ControlSpec, SceneChoice, SceneConfig, SceneDef } from './types';
import { STYLE_CONTROLS } from './shared';

const CHOICE_KEY = 'hero:scene';
const CHOICES: ReadonlyArray<SceneChoice> = ['random', 'horizon', 'shore'];
const HEX = /^#[0-9a-f]{6}$/i;

function configKey(id: string): string {
  return `hero:cfg:${id}`;
}

function safeStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

function sanitizeValue(spec: ControlSpec, value: unknown): number | string | undefined {
  switch (spec.kind) {
    case 'range': {
      if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
      return Math.min(spec.max, Math.max(spec.min, value));
    }
    case 'check':
      return value === 1 || value === 0 ? value : undefined;
    case 'select':
      return spec.options.some(([v]) => v === value) ? (value as number) : undefined;
    case 'color':
      return typeof value === 'string' && HEX.test(value) ? value.toLowerCase() : undefined;
  }
}

/** Keeps only known keys with in-range values; everything else falls back to defaults. */
export function parseStored(def: SceneDef, raw: unknown): SceneConfig {
  const config: SceneConfig = { ...def.defaults };
  if (!raw || typeof raw !== 'object') return config;
  const stored = raw as Record<string, unknown>;
  for (const spec of [...def.controls, ...STYLE_CONTROLS]) {
    const value = sanitizeValue(spec, stored[spec.key]);
    if (value !== undefined) config[spec.key] = value;
  }
  return config;
}

export function loadSceneConfig(def: SceneDef): SceneConfig {
  const storage = safeStorage();
  if (!storage) return { ...def.defaults };
  try {
    const raw = storage.getItem(configKey(def.id));
    return parseStored(def, raw ? JSON.parse(raw) : null);
  } catch {
    return { ...def.defaults };
  }
}

export function saveSceneConfig(def: SceneDef, config: SceneConfig): void {
  safeStorage()?.setItem(configKey(def.id), JSON.stringify(config));
}

export function clearSceneConfig(def: SceneDef): void {
  safeStorage()?.removeItem(configKey(def.id));
}

export function loadSceneChoice(): SceneChoice {
  const raw = safeStorage()?.getItem(CHOICE_KEY);
  return CHOICES.includes(raw as SceneChoice) ? (raw as SceneChoice) : 'random';
}

export function saveSceneChoice(choice: SceneChoice): void {
  safeStorage()?.setItem(CHOICE_KEY, choice);
}
