import { horizon } from './horizon';
import { shore } from './shore';
import { clearSceneConfig, loadSceneChoice, loadSceneConfig, loadSoundPref, loadSoundSource, saveSceneChoice, saveSceneConfig, saveSoundPref, saveSoundSource, type SoundSource } from './storage';
import type { SceneChoice, SceneConfig, SceneDef, SceneId } from './types';

export const SCENES: Record<SceneId, SceneDef> = { horizon, shore };

export type SceneState = {
  choice: SceneChoice;
  sceneId: SceneId;
  configs: Record<SceneId, SceneConfig>;
  sound: boolean;
  soundSource: SoundSource;
};

// Tiny external store so the Hero can hydrate with no scene (server snapshot) and pick one
// on the client without setting state inside an effect.
let state: SceneState | null = null;
const listeners = new Set<() => void>();

const pickRandom = (): SceneId => (Math.random() < 0.5 ? 'horizon' : 'shore');

/** `?scene=horizon|shore` forces a scene for this load only (shareable links); not persisted. */
function sceneFromUrl(): SceneId | null {
  if (typeof window === 'undefined') return null;
  const value = new URLSearchParams(window.location.search).get('scene');
  return value === 'horizon' || value === 'shore' ? value : null;
}

function emit(): void {
  listeners.forEach((fn) => fn());
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export function getSnapshot(): SceneState {
  if (!state) {
    const choice = loadSceneChoice();
    state = {
      choice,
      sceneId: sceneFromUrl() ?? (choice === 'random' ? pickRandom() : choice),
      configs: { horizon: loadSceneConfig(horizon), shore: loadSceneConfig(shore) },
      sound: loadSoundPref(),
      soundSource: loadSoundSource(),
    };
  }
  return state;
}

export function getServerSnapshot(): SceneState | null {
  return null;
}

export function setChoice(choice: SceneChoice): void {
  const current = getSnapshot();
  state = { ...current, choice, sceneId: choice === 'random' ? pickRandom() : choice };
  saveSceneChoice(choice);
  emit();
}

export function setConfig(id: SceneId, config: SceneConfig): void {
  const current = getSnapshot();
  state = { ...current, configs: { ...current.configs, [id]: config } };
  saveSceneConfig(SCENES[id], config);
  emit();
}

export function setSound(on: boolean): void {
  state = { ...getSnapshot(), sound: on };
  saveSoundPref(on);
  emit();
}

export function setSoundSource(source: SoundSource): void {
  state = { ...getSnapshot(), soundSource: source };
  saveSoundSource(source);
  emit();
}

export function resetConfig(id: SceneId): void {
  const current = getSnapshot();
  state = { ...current, configs: { ...current.configs, [id]: { ...SCENES[id].defaults } } };
  clearSceneConfig(SCENES[id]);
  emit();
}

/** Test-only: forget the cached state so the next snapshot re-reads storage. */
export function resetStoreForTests(): void {
  state = null;
}
