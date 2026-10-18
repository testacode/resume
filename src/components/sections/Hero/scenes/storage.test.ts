import { describe, it, expect, beforeEach } from 'vitest';
import { horizon } from './horizon';
import { shore } from './shore';
import {
  loadSceneChoice,
  loadSceneConfig,
  loadSoundPref,
  loadSoundSource,
  parseStored,
  saveSceneConfig,
  saveSoundPref,
  saveSoundSource,
} from './storage';

beforeEach(() => {
  localStorage.clear();
});

describe('parseStored', () => {
  it('returns defaults for garbage input', () => {
    expect(parseStored(horizon, null)).toEqual(horizon.defaults);
    expect(parseStored(horizon, 'nope')).toEqual(horizon.defaults);
    expect(parseStored(horizon, 42)).toEqual(horizon.defaults);
  });

  it('keeps known keys and clamps ranges', () => {
    const config = parseStored(horizon, { sunX: 5, waveAmp: -1, contrast: 1.7 });
    expect(config.sunX).toBe(0.95);
    expect(config.waveAmp).toBe(0);
    expect(config.contrast).toBe(1.7);
  });

  it('drops unknown keys, bad colors, bad selects and non-finite numbers', () => {
    const config = parseStored(shore, {
      hacker: 'x',
      sand: 'red',
      deep: '#ABCDEF',
      shoreMode: 7,
      style: 5,
      keepColor: 'yes',
      runup: Number.NaN,
    });
    expect(config).not.toHaveProperty('hacker');
    expect(config.sand).toBe(shore.defaults.sand);
    expect(config.deep).toBe('#abcdef');
    expect(config.shoreMode).toBe(shore.defaults.shoreMode);
    expect(config.style).toBe(5);
    expect(config.keepColor).toBe(shore.defaults.keepColor);
    expect(config.runup).toBe(shore.defaults.runup);
  });
});

describe('localStorage round trip', () => {
  it('saves and loads a scene config', () => {
    saveSceneConfig(horizon, { ...horizon.defaults, sunX: 0.2 });
    expect(loadSceneConfig(horizon).sunX).toBe(0.2);
    expect(loadSceneConfig(shore)).toEqual(shore.defaults);
  });

  it('falls back to defaults on corrupt JSON', () => {
    localStorage.setItem('hero:cfg:horizon', '{not json');
    expect(loadSceneConfig(horizon)).toEqual(horizon.defaults);
  });

  it('always draws at random and drops a legacy persisted choice', () => {
    localStorage.setItem('hero:scene', 'shore');
    expect(loadSceneChoice()).toBe('random');
    expect(localStorage.getItem('hero:scene')).toBeNull();
  });
});

describe('sound preference', () => {
  it('is on by default and remembers a mute', () => {
    expect(loadSoundPref()).toBe(true);
    saveSoundPref(false);
    expect(loadSoundPref()).toBe(false);
    saveSoundPref(true);
    expect(loadSoundPref()).toBe(true);
  });
});

describe('sound source', () => {
  it('defaults to the recording and remembers synth', () => {
    expect(loadSoundSource()).toBe('clip');
    saveSoundSource('synth');
    expect(loadSoundSource()).toBe('synth');
    localStorage.setItem('hero:soundSource', 'kazoo');
    expect(loadSoundSource()).toBe('clip');
  });
});

describe('presets', () => {
  it('only use keys that survive parseStored', () => {
    for (const def of [horizon, shore]) {
      for (const [name, preset] of Object.entries(def.presets)) {
        const parsed = parseStored(def, { ...def.defaults, ...preset });
        for (const key of Object.keys(preset)) {
          expect(parsed[key], `${def.id} / ${name} / ${key}`).toBe(preset[key]);
        }
      }
    }
  });
});
