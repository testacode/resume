import type { ControlSpec, SceneConfig, SceneDef } from './types';

export const VERTEX_SOURCE = `#version 300 es
in vec2 a; void main(){ gl_Position = vec4(a,0.,1.); }`;

const GLSL_NOISE = `
float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));
  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y); }
float fbm(vec2 p){ float v=0.,a=.5; mat2 m=mat2(1.6,1.2,-1.2,1.6); for(int i=0;i<5;i++){ v+=a*vnoise(p); p=m*p; a*=.5; } return v; }
`;

// Post pass: dither / halftone / lines / ASCII over `scene()`, then scanlines, grain, vignette.
const GLSL_STYLE = `
float bayer(ivec2 p, int bits){ int v=0; for(int i=0;i<bits;i++){ int bx=(p.x>>i)&1, by=(p.y>>i)&1; v=(v<<2)|((bx^by)<<1)|by; } return (float(v)+0.5)/float(1<<(2*bits)); }
vec3 ramp(float q){ vec3 pal[5]=vec3[5](u_pal0,u_pal1,u_pal2,u_pal3,u_pal4); float x=q*float(u_palN-1); int i=clamp(int(floor(x)),0,u_palN-2); return mix(pal[i], pal[i+1], x-float(i)); }
vec3 palDark(){ return u_pal0; }
vec3 palLight(){ vec3 pal[5]=vec3[5](u_pal0,u_pal1,u_pal2,u_pal3,u_pal4); return pal[u_palN-1]; }
float lumOf(vec3 c){ return clamp((dot(c, vec3(.299,.587,.114))-.5)*u_contrast+.5, 0., 1.); }
float character(int n, vec2 p){ p=floor(p*vec2(-4.,4.)+2.5); if(clamp(p.x,0.,4.)==p.x && clamp(p.y,0.,4.)==p.y){ int a=int(p.x+5.*p.y); if(((n>>a)&1)==1) return 1.; } return 0.; }
int glyph(float g){ int n=0; if(g>0.12)n=4096; if(g>0.22)n=65600; if(g>0.32)n=163153; if(g>0.42)n=15255086; if(g>0.52)n=13121101; if(g>0.62)n=15252014; if(g>0.72)n=13195790; if(g>0.82)n=11512810; return n; }
const mat2 ROT = mat2(.7071,.7071,-.7071,.7071);

void main(){
  vec2 fc = gl_FragCoord.xy; float cell = max(u_cell, 1.);
  vec3 c; vec3 outc;
  if (u_style == 3) {
    vec2 rr = ROT*(fc/cell); vec2 cen = floor(rr)+.5;
    c = scene(transpose(ROT)*cen*cell);
    float lum = lumOf(c); float d = length(rr-cen); float rad = sqrt(1.-lum)*0.72; float aa = 0.9/cell;
    float ink = 1.-smoothstep(rad-aa, rad+aa, d);
    outc = mix(palLight(), u_keepColor==1 ? c*0.55 : palDark(), ink);
  } else if (u_style == 5) {
    vec2 cc = floor(fc/cell); c = scene((cc+.5)*cell);
    float on = character(glyph(lumOf(c)), fract(fc/cell)*2.-1.);
    outc = mix(palDark(), u_keepColor==1 ? c : palLight(), on);
  } else if (u_style == 4) {
    c = scene(vec2(fc.x, (floor(fc.y/cell)+.5)*cell));
    float lum = lumOf(c); float f = fract(fc.y/cell); float w = 1.-lum; float aa = 0.9/cell;
    float ink = 1.-smoothstep(w-aa, w+aa, f);
    outc = mix(palLight(), u_keepColor==1 ? c*0.55 : palDark(), ink);
  } else {
    c = scene(fc);
    vec3 cc = clamp((c-.5)*u_contrast+.5, 0., 1.); float lum = lumOf(c);
    if (u_style == 0) outc = u_keepColor==1 ? cc : ramp(lum);
    else {
      ivec2 ci = ivec2(floor(fc/cell));
      float thr = u_style==1 ? bayer(ci & ((1<<u_bayerBits)-1), u_bayerBits) : hash(vec2(ci));
      float L = float(max(u_levels,2)-1);
      outc = u_keepColor==1 ? floor(cc*L+thr)/L : ramp(floor(lum*L+thr)/L);
    }
  }
  if (u_scan > 0.) outc *= 1. - u_scan*0.45*step(.5, fract(fc.y*0.5));
  if (u_grain > 0.) outc += (hash(fc + fract(u_time)*113.)-.5)*u_grain;
  if (u_vignette > 0.) { vec2 q = fc/u_res-.5; outc *= 1. - u_vignette*smoothstep(0.35, 1.1, length(q)*1.5); }
  fragColor = vec4(clamp(outc,0.,1.), 1.);
}`;

export const STYLE_CONTROLS: ReadonlyArray<ControlSpec> = [
  {
    kind: 'select', key: 'style', label: 'Technique', group: 'Style',
    options: [[0, 'Clean'], [1, 'Bayer dither'], [2, 'Noise dither'], [3, 'Halftone'], [4, 'Engraved lines'], [5, 'ASCII']],
  },
  { kind: 'range', key: 'cell', label: 'Cell (px)', group: 'Style', min: 1, max: 16, step: 1 },
  { kind: 'range', key: 'levels', label: 'Tones', group: 'Style', min: 2, max: 8, step: 1, int: true },
  { kind: 'select', key: 'bayerBits', label: 'Bayer matrix', group: 'Style', options: [[1, '2×2'], [2, '4×4'], [3, '8×8']] },
  { kind: 'check', key: 'keepColor', label: 'Keep scene color', group: 'Style' },
  { kind: 'range', key: 'contrast', label: 'Contrast', group: 'Style', min: 0.5, max: 2.5, step: 0.05 },
  { kind: 'range', key: 'palN', label: 'Palette colors (dark → light)', group: 'Style', min: 2, max: 5, step: 1, int: true },
  { kind: 'color', key: 'pal0', label: 'Palette 1', group: 'Style' },
  { kind: 'color', key: 'pal1', label: 'Palette 2', group: 'Style' },
  { kind: 'color', key: 'pal2', label: 'Palette 3', group: 'Style' },
  { kind: 'color', key: 'pal3', label: 'Palette 4', group: 'Style' },
  { kind: 'color', key: 'pal4', label: 'Palette 5', group: 'Style' },
  { kind: 'range', key: 'renderScale', label: 'Render resolution', group: 'Style', min: 0.25, max: 1, step: 0.05, uniform: false },
  { kind: 'range', key: 'scan', label: 'Scanlines', group: 'Post', min: 0, max: 1, step: 0.02 },
  { kind: 'range', key: 'grain', label: 'Grain', group: 'Post', min: 0, max: 0.3, step: 0.01 },
  { kind: 'range', key: 'vignette', label: 'Vignette', group: 'Post', min: 0, max: 1, step: 0.02 },
];

export const STYLE_DEFAULTS: SceneConfig = {
  style: 1, cell: 3, levels: 4, bayerBits: 3, keepColor: 0, contrast: 1.1, palN: 4,
  pal0: '#171f1e', pal1: '#2f5e56', pal2: '#7fdcc8', pal3: '#eef7f4', pal4: '#ffffff',
  renderScale: 1, scan: 0, grain: 0, vignette: 0.25,
};

function uniformType(spec: ControlSpec): string {
  switch (spec.kind) {
    case 'color': return 'vec3';
    case 'check':
    case 'select': return 'int';
    case 'range': return spec.int ? 'int' : 'float';
  }
}

export function isUniform(spec: ControlSpec): boolean {
  return spec.uniform !== false;
}

export function buildFragmentSource(def: SceneDef): string {
  const declared = new Set<string>();
  const uniforms = [...def.controls, ...STYLE_CONTROLS]
    .filter(isUniform)
    .filter((spec) => !declared.has(spec.key) && declared.add(spec.key))
    .map((spec) => `uniform ${uniformType(spec)} u_${spec.key};`)
    .join('\n');
  return `#version 300 es
precision highp float; precision highp int;
out vec4 fragColor;
uniform vec2 u_res; uniform float u_time;
${uniforms}
${GLSL_NOISE}
${def.body}
${GLSL_STYLE}`;
}

export function hexToRgb(hex: string): [number, number, number] {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
}
