import type { ControlSpec, SceneDef } from './types';
import { STYLE_DEFAULTS } from './shared';

// Horizon: procedural ocean at eye level, sun on the horizon. `u_horizon` is set from the
// bottom edge of the <h1>, so the name always sits on the horizon line.
const body = `
uniform float u_horizon;
const float FOCAL = 1.2;

float waveH(vec2 xz, float t){
  float h = sin(xz.y*0.9*u_waveScale + t*1.1)*0.35
          + sin((xz.x*0.6+xz.y*0.8)*u_waveScale + t*0.8)*0.25
          + (fbm(xz*u_waveScale*1.5 + vec2(t*0.35, t*0.2)) - 0.5)*u_choppy*1.4;
  return h*u_waveAmp;
}
vec3 waterNormal(vec2 xz, float t, float dist){
  float e = 0.08 + dist*0.02;
  float h0=waveH(xz,t), hx=waveH(xz+vec2(e,0),t), hz=waveH(xz+vec2(0,e),t);
  vec3 n = normalize(vec3(h0-hx, e, h0-hz));
  return normalize(mix(n, vec3(0,1,0), clamp(dist/70., 0., .85)));
}
vec3 sunDir(float aspect){ return normalize(vec3((u_sunX-0.5)*aspect, u_sunY, FOCAL)); }

vec3 sky(vec3 d, vec3 sd, float t){
  float h = clamp(d.y*2.2, 0., 1.);
  vec3 c = mix(u_skyHorizon, u_skyTop, pow(h, 0.55));
  float ang = max(dot(normalize(d), sd), 0.);
  c += u_sunColor * (pow(ang, 24.)*0.6 + pow(ang, 6.)*0.25) * u_sunGlow;
  if (u_clouds > 0.001 && d.y > 0.005) {
    vec2 cp = d.xz * (6./d.y);
    float cl = fbm(cp*0.09 + vec2(t*0.04, 0.));
    float cover = smoothstep(0.62 - u_clouds*0.28, 0.82, cl) * smoothstep(0.0, 0.12, d.y);
    vec3 cloudCol = mix(u_skyHorizon, vec3(1.), 0.55) + u_sunColor*0.25*pow(ang, 4.);
    c = mix(c, cloudCol, cover*0.9);
  }
  return c;
}

vec3 scene(vec2 fc){
  vec2 uv = fc/u_res; float aspect = u_res.x/u_res.y; float t = u_time*u_waveSpeed;
  vec3 dir = normalize(vec3((uv.x-0.5)*aspect, uv.y-u_horizon, FOCAL));
  vec3 sd = sunDir(aspect);
  vec3 col;
  if (dir.y < 0.) {
    float dist = u_camH/(-dir.y);
    vec3 p = dir*dist;
    vec3 n = waterNormal(p.xz, t, dist);
    vec3 R = reflect(dir, n); R.y = abs(R.y);
    vec3 refl = sky(R, sd, t);
    float fres = 0.04 + 0.96*pow(1.-max(dot(-dir,n),0.), 5.);
    float hgt = waveH(p.xz,t)/max(u_waveAmp,1e-3);
    vec3 water = mix(u_waterDeep, u_waterShallow, clamp(hgt*0.5+0.5,0.,1.)*0.7);
    float spec = pow(max(dot(R, sd),0.), mix(400., 60., u_choppy)) * u_reflect * 2.5;
    col = mix(water, refl, fres) + u_sunColor*spec;
    float fog = 1.-exp(-dist*u_fog*0.012);
    col = mix(col, sky(vec3(dir.x, 0.003, dir.z), sd, t), fog);
  } else {
    col = sky(dir, sd, t);
    vec2 sp = vec2((uv.x-u_sunX)*aspect, uv.y-u_horizon-u_sunY);
    float d = length(sp);
    float disc = 1.-smoothstep(u_sunSize*0.8, u_sunSize, d);
    col = mix(col, u_sunColor, disc);
  }
  return col;
}`;

const controls: ReadonlyArray<ControlSpec> = [
  { kind: 'range', key: 'sunX', label: 'Sun X', group: 'Scene', min: 0.05, max: 0.95, step: 0.01 },
  { kind: 'range', key: 'sunY', label: 'Sun height', group: 'Scene', min: 0, max: 0.4, step: 0.005 },
  { kind: 'range', key: 'sunSize', label: 'Sun size', group: 'Scene', min: 0, max: 0.12, step: 0.002 },
  { kind: 'range', key: 'sunGlow', label: 'Sun glow', group: 'Scene', min: 0, max: 1, step: 0.02 },
  { kind: 'range', key: 'clouds', label: 'Clouds', group: 'Scene', min: 0, max: 1, step: 0.02 },
  { kind: 'color', key: 'skyTop', label: 'Sky (top)', group: 'Scene' },
  { kind: 'color', key: 'skyHorizon', label: 'Sky (horizon)', group: 'Scene' },
  { kind: 'color', key: 'sunColor', label: 'Sun', group: 'Scene' },
  { kind: 'color', key: 'waterDeep', label: 'Deep water', group: 'Scene' },
  { kind: 'color', key: 'waterShallow', label: 'Wave crest', group: 'Scene' },
  { kind: 'range', key: 'waveAmp', label: 'Amplitude', group: 'Water', min: 0, max: 1.5, step: 0.02 },
  { kind: 'range', key: 'waveSpeed', label: 'Speed', group: 'Water', min: 0, max: 2, step: 0.02 },
  { kind: 'range', key: 'waveScale', label: 'Wave scale', group: 'Water', min: 0.1, max: 1.5, step: 0.02 },
  { kind: 'range', key: 'choppy', label: 'Chop', group: 'Water', min: 0, max: 1, step: 0.02 },
  { kind: 'range', key: 'camH', label: 'Camera height', group: 'Water', min: 0.5, max: 8, step: 0.1 },
  { kind: 'range', key: 'reflect', label: 'Sun reflection', group: 'Water', min: 0, max: 2, step: 0.05 },
  { kind: 'range', key: 'fog', label: 'Haze', group: 'Water', min: 0, max: 2, step: 0.05 },
  { kind: 'color', key: 'textTop', label: 'Text', group: 'Text', uniform: false },
  { kind: 'color', key: 'accent', label: 'Accent', group: 'Text', uniform: false },
  { kind: 'color', key: 'veilColor', label: 'Veil color', group: 'Text', uniform: false },
  { kind: 'range', key: 'veilOpacity', label: 'Veil opacity', group: 'Text', min: 0, max: 1, step: 0.02, uniform: false },
];

export const horizon: SceneDef = {
  id: 'horizon',
  label: 'Horizon',
  body,
  controls,
  anchorHorizon: true,
  defaults: {
    ...STYLE_DEFAULTS,
    sunX: 0.94, sunY: 0.255, sunSize: 0.032, sunGlow: 0.52, clouds: 0.02,
    skyTop: '#10002a', skyHorizon: '#ff2d95', sunColor: '#ffe2f7', waterDeep: '#001a2e', waterShallow: '#00c2d1',
    waveAmp: 0.56, waveSpeed: 0.34, waveScale: 0.32, choppy: 0.74, camH: 0.5, reflect: 0.5, fog: 1.4,
    style: 1, cell: 2, levels: 6, bayerBits: 2, keepColor: 1, contrast: 1.3, renderScale: 0.5,
    scan: 0.3, grain: 0.1, vignette: 0.32,
    textTop: '#e8fdff', accent: '#ff33ee', veilColor: '#10002a', veilOpacity: 0.16,
  },
  presets: {
    'Night CRT': {},
    'Teal engraving': {
      style: 1, cell: 3, bayerBits: 3, levels: 4, keepColor: 0, contrast: 1.1, renderScale: 1, scan: 0, grain: 0, vignette: 0.25,
      skyTop: '#15201e', skyHorizon: '#3f7a6f', sunColor: '#ffffff', waterDeep: '#0f2a26', waterShallow: '#2c6b60',
      sunGlow: 0.5, textTop: '#f3f8f6', accent: '#7fdcc8', veilColor: '#171f1e', veilOpacity: 0.35,
    },
    'Clean sunset': {
      style: 0, keepColor: 1, contrast: 1.1, renderScale: 1, scan: 0, grain: 0.05, vignette: 0.35,
      skyTop: '#3b2a5a', skyHorizon: '#ff9a5c', sunColor: '#fff1c4', waterDeep: '#16324a', waterShallow: '#3d7a8c',
      sunGlow: 0.85, sunSize: 0.045, textTop: '#ffffff', accent: '#ffd37a', veilColor: '#1a1030', veilOpacity: 0.3,
    },
    'Game Boy': {
      style: 1, cell: 4, bayerBits: 2, levels: 4, keepColor: 0, contrast: 1.25, renderScale: 0.5, scan: 0, grain: 0,
      palN: 4, pal0: '#0f380f', pal1: '#306230', pal2: '#8bac0f', pal3: '#9bbc0f',
      textTop: '#9bbc0f', accent: '#8bac0f', veilColor: '#0f380f', veilOpacity: 0.4,
    },
    '1-bit': {
      style: 1, cell: 2, bayerBits: 3, levels: 2, keepColor: 0, contrast: 1.2, renderScale: 1, scan: 0, grain: 0, vignette: 0,
      palN: 2, pal0: '#000000', pal1: '#ffffff', textTop: '#ffffff', accent: '#ffffff', veilColor: '#000000', veilOpacity: 0.45,
    },
    ASCII: {
      style: 5, cell: 10, keepColor: 0, contrast: 1.2, renderScale: 1, scan: 0, grain: 0, vignette: 0.3,
      palN: 2, pal0: '#060a06', pal1: '#67ff8a', textTop: '#e9ffee', accent: '#67ff8a', veilColor: '#060a06', veilOpacity: 0.5,
    },
  },
};
