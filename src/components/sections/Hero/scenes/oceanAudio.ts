import type { SceneId } from './types';

// Sea ambience from real recordings (CC0), one seamless loop per scene in /public/audio
// (built with scripts/make-sea-loop.sh). Horizon is additionally low-passed so it sits far away.
// The AudioContext is created lazily: browsers only let audio start after a user gesture.

export type OceanAudio = {
  /** Resolves `true` once audio is actually running (may be `false` until a user gesture). */
  start: () => Promise<boolean>;
  stop: () => void;
  setVolume: (volume: number) => void;
  setScene: (scene: SceneId) => void;
  dispose: () => void;
};

const FADE_SECONDS = 0.6;
const SCENE_TONE: Record<SceneId, number> = { shore: 20000, horizon: 2600 };
const SCENE_GAIN: Record<SceneId, number> = { shore: 1, horizon: 0.8 };

function clipUrl(scene: SceneId): string {
  const opus = typeof Audio !== 'undefined' && new Audio().canPlayType('audio/ogg; codecs=opus') !== '';
  return `/audio/${scene}.${opus ? 'ogg' : 'm4a'}`;
}

type Voice = { source: AudioBufferSourceNode; gain: GainNode };
type Graph = { ctx: AudioContext; master: GainNode; tone: BiquadFilterNode };

function buildGraph(): Graph {
  const ctx = new AudioContext();
  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  const master = ctx.createGain();
  master.gain.value = 0;
  tone.connect(master).connect(ctx.destination);
  return { ctx, master, tone };
}

export function createOceanAudio(): OceanAudio {
  let g: Graph | null = null;
  let voice: Voice | null = null;
  let scene: SceneId = 'horizon';
  let volume = 0.5;
  let running = false;
  const buffers = new Map<SceneId, Promise<AudioBuffer>>();

  const graph = (): Graph => (g ??= buildGraph());

  const load = (id: SceneId) => {
    let pending = buffers.get(id);
    if (!pending) {
      pending = fetch(clipUrl(id))
        .then((res) => res.arrayBuffer())
        .then((data) => graph().ctx.decodeAudioData(data));
      buffers.set(id, pending);
    }
    return pending;
  };

  const ramp = (param: AudioParam, value: number, seconds: number) => {
    const { ctx } = graph();
    param.cancelScheduledValues(ctx.currentTime);
    param.setTargetAtTime(value, ctx.currentTime, seconds / 3);
  };

  const play = async (id: SceneId) => {
    const buffer = await load(id);
    const { ctx, tone } = graph();
    if (!running || id !== scene) return;
    if (voice) {
      const old = voice;
      ramp(old.gain.gain, 0, FADE_SECONDS);
      old.source.stop(ctx.currentTime + FADE_SECONDS * 2);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    source.connect(gain).connect(tone);
    source.start(0, Math.random() * buffer.duration);
    ramp(gain.gain, SCENE_GAIN[id], FADE_SECONDS);
    ramp(tone.frequency, SCENE_TONE[id], FADE_SECONDS);
    voice = { source, gain };
  };

  return {
    async start() {
      if (typeof AudioContext === 'undefined') return false;
      const { ctx, master } = graph();
      running = true;
      if (ctx.state === 'suspended') await ctx.resume().catch(() => undefined);
      if (ctx.state !== 'running') return false;
      ramp(master.gain, volume, FADE_SECONDS);
      if (!voice) void play(scene);
      return true;
    },
    stop() {
      running = false;
      if (g) ramp(g.master.gain, 0, FADE_SECONDS);
    },
    setVolume(next) {
      volume = next;
      if (g && running) ramp(g.master.gain, volume, 0.1);
    },
    setScene(next) {
      if (next === scene && voice) return;
      scene = next;
      if (running) void play(next);
    },
    dispose() {
      running = false;
      g?.ctx.close();
      g = null;
      voice = null;
    },
  };
}
