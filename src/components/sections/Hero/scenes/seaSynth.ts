import type { SceneId } from './types';
import type { OceanAudio } from './oceanAudio';
import { seaEnvelope } from './seaEnvelope';

// Envelope-following resynthesis: pink noise shaped by the level/brightness curve extracted
// from the real recording (scripts/analyze-sea-envelope.py). Same OceanAudio interface as the
// clip player so the Hero can A/B them. The curve is played from a random offset and wraps
// around, so it never audibly loops; horizon is low-passed like the clip.

const SCENE_TONE: Record<SceneId, number> = { shore: 6000, horizon: 2600 };
const SCENE_GAIN: Record<SceneId, number> = { shore: 1, horizon: 0.8 };
const LOOKAHEAD = 0.4;
const FADE_SECONDS = 0.6;

function decode(b64: string): Float32Array {
  const bytes = atob(b64);
  const out = new Float32Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) out[i] = bytes.charCodeAt(i) / 255;
  return out;
}

function pinkNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const buffer = ctx.createBuffer(2, ctx.sampleRate * seconds, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  }
  return buffer;
}

type Graph = { ctx: AudioContext; master: GainNode; tone: BiquadFilterNode; shape: BiquadFilterNode; level: GainNode };

function buildGraph(): Graph {
  const ctx = new AudioContext();
  const noise = ctx.createBufferSource();
  noise.buffer = pinkNoiseBuffer(ctx, 8);
  noise.loop = true;
  // shape: the moving low-pass that tracks brightness; tone: the per-scene distance low-pass.
  const shape = ctx.createBiquadFilter();
  shape.type = 'lowpass';
  shape.Q.value = 0.4;
  const level = ctx.createGain();
  level.gain.value = 0;
  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  const master = ctx.createGain();
  master.gain.value = 0;
  noise.connect(shape).connect(level).connect(tone).connect(master).connect(ctx.destination);
  noise.start();
  return { ctx, master, tone, shape, level };
}

export function createSeaSynth(): OceanAudio {
  const levels = decode(seaEnvelope.level);
  const brights = decode(seaEnvelope.bright);
  const hop = seaEnvelope.hop;
  let g: Graph | null = null;
  let scene: SceneId = 'horizon';
  let volume = 0.5;
  let duck = 1;
  let running = false;
  let timer = 0;
  let cursor = Math.floor(Math.random() * levels.length);
  let nextAt = 0;

  const graph = (): Graph => (g ??= buildGraph());
  const ramp = (param: AudioParam, value: number, seconds: number) => {
    const { ctx } = graph();
    param.cancelScheduledValues(ctx.currentTime);
    param.setTargetAtTime(value, ctx.currentTime, seconds / 3);
  };

  // Schedules the next hops of the curve a little ahead of the clock.
  const tick = () => {
    if (!g || !running) return;
    const { ctx, shape, level } = g;
    while (nextAt < ctx.currentTime + LOOKAHEAD) {
      const l = levels[cursor];
      const b = brights[cursor];
      level.gain.linearRampToValueAtTime(0.08 + l * 0.9, nextAt + hop);
      shape.frequency.exponentialRampToValueAtTime(500 + b * 4500, nextAt + hop);
      cursor = (cursor + 1) % levels.length;
      nextAt += hop;
    }
    timer = window.setTimeout(tick, hop * 1000 * 2);
  };

  return {
    async start() {
      if (typeof AudioContext === 'undefined') return false;
      const { ctx, master, tone, level, shape } = graph();
      running = true;
      if (ctx.state === 'suspended') await ctx.resume().catch(() => undefined);
      if (ctx.state !== 'running') return false;
      tone.frequency.value = SCENE_TONE[scene];
      level.gain.setValueAtTime(level.gain.value, ctx.currentTime);
      shape.frequency.setValueAtTime(Math.max(shape.frequency.value, 500), ctx.currentTime);
      nextAt = ctx.currentTime + 0.05;
      window.clearTimeout(timer);
      tick();
      ramp(master.gain, volume * duck * SCENE_GAIN[scene], FADE_SECONDS);
      return true;
    },
    stop() {
      running = false;
      window.clearTimeout(timer);
      if (g) ramp(g.master.gain, 0, FADE_SECONDS);
    },
    setVolume(next) {
      volume = next;
      if (g && running) ramp(g.master.gain, volume * duck * SCENE_GAIN[scene], 0.1);
    },
    setDuck(factor) {
      duck = Math.min(1, Math.max(0, factor));
      if (g && running) ramp(g.master.gain, volume * duck * SCENE_GAIN[scene], 0.3);
    },
    setScene(next) {
      scene = next;
      if (!g) return;
      ramp(g.tone.frequency, SCENE_TONE[scene], 0.8);
      if (running) ramp(g.master.gain, volume * duck * SCENE_GAIN[scene], 0.8);
    },
    dispose() {
      running = false;
      window.clearTimeout(timer);
      g?.ctx.close();
      g = null;
    },
  };
}
