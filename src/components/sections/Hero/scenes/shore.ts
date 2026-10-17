import type { ControlSpec, SceneDef } from './types';
import { STYLE_DEFAULTS } from './shared';

// Shore: top-down beach. Water from the top edge down to the name, which is the coastline;
// sand below. The <h1> is rasterized into `u_mask`/`u_profile` so waves break on the letters.
const body = `
uniform sampler2D u_mask, u_profile;
uniform float u_blockTop, u_blockBottom;

float shoreAt(float x){
  float w = (vnoise(vec2(x/u_res.x*u_wobbleFreq*6., 1.7))-.5)*2.*u_wobbleAmp*u_res.y;
  if (u_shoreMode == 0) return u_blockTop*u_res.y + w;
  vec3 pr = texture(u_profile, vec2(x/u_res.x, .5)).rgb;
  float gap = mix(u_blockTop, u_blockBottom, u_gapDepth)*u_res.y;
  float s = pr.b > .5 ? pr.r*u_res.y : gap;
  return s + w*.35;
}
float shore(float x){
  float px = u_res.x/1200.*2.5; float acc = 0., wsum = 0.;
  for (int i=-4;i<=4;i++){ float w = 5.-abs(float(i)); acc += shoreAt(x+float(i)*px)*w; wsum += w; }
  return acc/wsum;
}

vec3 scene(vec2 fc){
  vec2 p = vec2(fc.x, u_res.y - fc.y);
  float t = u_time; float H = u_res.y;
  float S = shore(p.x);
  float dsh = S - p.y;

  vec3 sand = u_sand * (1. + (hash(floor(p*0.7))-.5)*u_grainSand) * (1. + (fbm(p*0.01)-.5)*u_sandVar);

  float ph2 = t*u_swashRate + fbm(vec2(p.x*0.003, 2.3))*u_irreg*1.5;
  float phase = fract(ph2);
  float env = phase < .35 ? smoothstep(0.,1.,phase/.35) : 1.-smoothstep(0.,1.,(phase-.35)/.65);
  float runpx = u_runup*H*(0.7+0.6*vnoise(vec2(p.x*0.01, floor(ph2)*7.1)));
  float edge = S + runpx*env;
  float wetLevel = phase < .35 ? env : mix(1., .1, pow((phase-.35)/.65, 1./u_wetMemory));
  float wetEdge = S + runpx*wetLevel;
  float wet = smoothstep(wetEdge+6., wetEdge-6., p.y)*step(S-1., p.y);
  sand = mix(sand, u_wetSand, wet*u_wetDark);

  float Sb = (u_shoreMode == 0 ? u_blockTop : mix(u_blockTop, u_blockBottom, u_gapDepth*.5))*H;
  float depth = clamp((Sb - p.y)/(u_depthRange*H), 0., 1.);
  vec3 water = mix(u_shallow, u_deep, pow(depth, .7));
  water = mix(sand, water, .15+.85*smoothstep(0., .25, depth));
  float ph = p.y*u_waveFreq*0.05 - t*u_waveSpeed*3. + fbm(vec2(p.x*0.004, p.y*0.002)+t*0.05)*2.;
  float crest = smoothstep(.55, .95, sin(ph));
  water += crest*u_crest*.25*(.4+.6*(1.-depth));
  float breaking = 1.-smoothstep(0., .5, depth);
  float ftex = fbm(p*0.03 + vec2(0., -t*0.6));
  float foam = crest*breaking*smoothstep(.45, .7, ftex)*u_foamAmt;
  water = mix(water, u_foam, clamp(foam,0.,1.));
  water = mix(water, u_foam, clamp(u_foamAmt*.35*breaking*smoothstep(.6,.8,fbm(p*0.015+vec2(t*.1,0.))),0.,1.));
  water += u_caustics*.15*pow(vnoise(p*0.05+t*.3)*vnoise(p*0.05-t*.2), 2.)*(1.-depth);
  water += u_glints*.8*step(.995, hash(floor(p*.5)+floor(t*6.)))*depth;

  vec3 col = mix(sand, water, smoothstep(-1.5, 1.5, dsh));

  float m = texture(u_mask, fc/u_res).r;
  col = mix(col, u_letterColor, m*u_letterOpacity);

  float tongue = smoothstep(edge+2., edge-2., p.y)*step(S-1., p.y);
  float ttex = smoothstep(.35, .75, fbm(p*0.04+vec2(0., t*.8)));
  vec3 tongueCol = mix(u_wetSand, u_foam, ttex*.9);
  col = mix(col, tongueCol, tongue*.85*(1.-m*u_letterOpacity));
  col = mix(col, u_foam, tongue*ttex*.35*m*u_letterOpacity);
  float edgeLine = smoothstep(u_foamWidth*10.+2., 0., abs(p.y-edge))*step(S-1., p.y)*step(.05, env);
  col = mix(col, u_foam, edgeLine*.95);
  return col;
}`;

const controls: ReadonlyArray<ControlSpec> = [
  { kind: 'select', key: 'shoreMode', label: 'Coastline', group: 'Coast', options: [[0, 'Straight line above the name'], [1, 'Follow the letters']] },
  { kind: 'range', key: 'gapDepth', label: 'Water between letters', group: 'Coast', min: 0, max: 1, step: 0.02 },
  { kind: 'range', key: 'wobbleAmp', label: 'Coast wobble', group: 'Coast', min: 0, max: 0.05, step: 0.001 },
  { kind: 'range', key: 'wobbleFreq', label: 'Wobble frequency', group: 'Coast', min: 0.2, max: 4, step: 0.1 },
  { kind: 'color', key: 'letterColor', label: 'Letters', group: 'Coast' },
  { kind: 'range', key: 'letterOpacity', label: 'Letter opacity', group: 'Coast', min: 0, max: 1, step: 0.02 },
  { kind: 'range', key: 'runup', label: 'Run-up onto the sand', group: 'Swash', min: 0, max: 0.3, step: 0.005 },
  { kind: 'range', key: 'swashRate', label: 'Waves per second', group: 'Swash', min: 0.03, max: 0.5, step: 0.01 },
  { kind: 'range', key: 'irreg', label: 'Front irregularity', group: 'Swash', min: 0, max: 1.5, step: 0.05 },
  { kind: 'range', key: 'foamWidth', label: 'Foam thickness', group: 'Swash', min: 0, max: 1.5, step: 0.05 },
  { kind: 'range', key: 'wetDark', label: 'Wet sand darkening', group: 'Swash', min: 0, max: 1, step: 0.02 },
  { kind: 'range', key: 'wetMemory', label: 'Wet memory', group: 'Swash', min: 0.3, max: 3, step: 0.1 },
  { kind: 'color', key: 'deep', label: 'Deep water', group: 'Water' },
  { kind: 'color', key: 'shallow', label: 'Shallow water', group: 'Water' },
  { kind: 'color', key: 'foam', label: 'Foam', group: 'Water' },
  { kind: 'range', key: 'depthRange', label: 'Depth falloff', group: 'Water', min: 0.1, max: 1, step: 0.02 },
  { kind: 'range', key: 'waveFreq', label: 'Wave frequency', group: 'Water', min: 0.2, max: 3, step: 0.05 },
  { kind: 'range', key: 'waveSpeed', label: 'Wave speed', group: 'Water', min: 0, max: 2, step: 0.02 },
  { kind: 'range', key: 'crest', label: 'Crests', group: 'Water', min: 0, max: 1.5, step: 0.05 },
  { kind: 'range', key: 'foamAmt', label: 'Breaking foam', group: 'Water', min: 0, max: 1.5, step: 0.05 },
  { kind: 'range', key: 'caustics', label: 'Caustics', group: 'Water', min: 0, max: 1.5, step: 0.05 },
  { kind: 'range', key: 'glints', label: 'Glints', group: 'Water', min: 0, max: 1.5, step: 0.05 },
  { kind: 'color', key: 'sand', label: 'Sand', group: 'Sand' },
  { kind: 'color', key: 'wetSand', label: 'Wet sand', group: 'Sand' },
  { kind: 'range', key: 'grainSand', label: 'Grain', group: 'Sand', min: 0, max: 0.8, step: 0.02 },
  { kind: 'range', key: 'sandVar', label: 'Patches', group: 'Sand', min: 0, max: 1, step: 0.02 },
  { kind: 'color', key: 'textTop', label: 'Text over water', group: 'Text', uniform: false },
  { kind: 'color', key: 'textBottom', label: 'Text over sand', group: 'Text', uniform: false },
  { kind: 'color', key: 'accent', label: 'Accent', group: 'Text', uniform: false },
  { kind: 'color', key: 'veilColor', label: 'Veil color', group: 'Text', uniform: false },
  { kind: 'range', key: 'veilOpacity', label: 'Veil opacity', group: 'Text', min: 0, max: 1, step: 0.02, uniform: false },
];

export const shore: SceneDef = {
  id: 'shore',
  label: 'Shore',
  body,
  controls,
  textMask: true,
  defaults: {
    ...STYLE_DEFAULTS,
    shoreMode: 0, gapDepth: 0, wobbleAmp: 0.05, wobbleFreq: 2.3, letterColor: '#2b2118', letterOpacity: 1,
    runup: 0.025, swashRate: 0.27, irreg: 0.55, foamWidth: 1.5, wetDark: 0.3, wetMemory: 2.9,
    deep: '#0b4f6c', shallow: '#5fc8c3', foam: '#f7fbfb', depthRange: 0.48, waveFreq: 0.55, waveSpeed: 0.36,
    crest: 0.6, foamAmt: 1.5, caustics: 1, glints: 0.5,
    sand: '#e6d3ae', wetSand: '#b89a6a', grainSand: 0.2, sandVar: 0.14,
    style: 1, cell: 3, levels: 6, bayerBits: 3, keepColor: 1, contrast: 1.4, renderScale: 0.95, vignette: 0.22,
    textTop: '#0f2f3a', textBottom: '#2b2118', accent: '#0b4f6c', veilColor: '#efe2c4', veilOpacity: 0.6,
  },
  presets: {
    'Noon dither': {},
    'Noon clean': { style: 0, contrast: 1, renderScale: 1, vignette: 0.15 },
    Sunset: {
      style: 0, contrast: 1, renderScale: 1, grain: 0.04, vignette: 0.35,
      deep: '#2a1f5e', shallow: '#d4777a', foam: '#ffe9d6', sand: '#d9b48f', wetSand: '#8d6a52',
      letterColor: '#2a1f3e', textBottom: '#2a1f3e', textTop: '#2a1f3e', accent: '#ff8a5c', glints: 0.8, veilColor: '#e8c9a6',
    },
    'Teal engraving': {
      style: 1, cell: 3, bayerBits: 3, levels: 4, keepColor: 0, contrast: 1.15, renderScale: 1,
      palN: 4, pal0: '#171f1e', pal1: '#2f5e56', pal2: '#7fdcc8', pal3: '#eef7f4',
      letterColor: '#171f1e', sand: '#8fd6c6', wetSand: '#4f9b8c', deep: '#0e2f2a', shallow: '#2c6b60', foam: '#f0faf7',
      textTop: '#171f1e', textBottom: '#171f1e', accent: '#2f5e56', veilColor: '#a9e2d6',
    },
    Risograph: {
      style: 3, cell: 5, keepColor: 0, contrast: 1.25, renderScale: 1, palN: 2, pal0: '#0a3fa0', pal1: '#f2eee6',
      letterColor: '#0a3fa0', sand: '#f0e8d6', wetSand: '#b9b2a0', deep: '#1b2a55', shallow: '#5d7fc6', foam: '#ffffff',
      textTop: '#0a3fa0', textBottom: '#0a3fa0', accent: '#ff5fa2', veilColor: '#f2eee6',
    },
    '1-bit': {
      style: 1, cell: 2, bayerBits: 3, levels: 2, keepColor: 0, contrast: 1.3, renderScale: 1, vignette: 0,
      palN: 2, pal0: '#000000', pal1: '#ffffff', letterColor: '#000000', sand: '#ffffff', wetSand: '#9a9a9a',
      deep: '#101010', shallow: '#707070', foam: '#ffffff', textTop: '#000000', textBottom: '#000000', accent: '#000000', veilColor: '#ffffff',
    },
    ASCII: {
      style: 5, cell: 10, keepColor: 0, contrast: 1.3, renderScale: 1, palN: 2, pal0: '#060a06', pal1: '#67ff8a',
      letterColor: '#ffffff', sand: '#2d3a2d', wetSand: '#1b241b', deep: '#050805', shallow: '#1f4f2a', foam: '#cfffd9',
      textTop: '#e9ffee', textBottom: '#e9ffee', accent: '#67ff8a', veilColor: '#060a06',
    },
  },
};
