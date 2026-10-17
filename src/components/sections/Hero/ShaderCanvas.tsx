'use client';

import { useEffect, useRef, type RefObject } from 'react';
import type { SceneConfig, SceneDef } from './scenes/types';
import { STYLE_CONTROLS, VERTEX_SOURCE, buildFragmentSource, hexToRgb, isUniform } from './scenes/shared';
import { buildTextMask, untransformedOffset } from './scenes/textMask';
import styles from './ShaderCanvas.module.css';

type Props = {
  scene: SceneDef;
  config: SceneConfig;
  /** The hero `<h1>`: horizon anchors to its bottom edge, shore rasterizes it. */
  anchorRef: RefObject<HTMLHeadingElement | null>;
  onReady: (ready: boolean) => void;
};

type Program = {
  gl: WebGL2RenderingContext;
  prog: WebGLProgram;
  uniforms: Map<string, WebGLUniformLocation>;
  maskTex: WebGLTexture | null;
  profileTex: WebGLTexture | null;
};

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('[hero-scene]', type === gl.VERTEX_SHADER ? 'vertex' : 'fragment', 'lost:', gl.isContextLost(), gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext, scene: SceneDef): Program | null {
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SOURCE);
  const fs = compile(gl, gl.FRAGMENT_SHADER, buildFragmentSource(scene));
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('[hero-scene]', gl.getProgramInfoLog(prog));
    return null;
  }
  gl.useProgram(prog);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniforms = new Map<string, WebGLUniformLocation>();
  const count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS) as number;
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(prog, i);
    const location = info && gl.getUniformLocation(prog, info.name);
    if (info && location) uniforms.set(info.name, location);
  }

  let maskTex: WebGLTexture | null = null;
  let profileTex: WebGLTexture | null = null;
  if (scene.textMask) {
    maskTex = gl.createTexture();
    profileTex = gl.createTexture();
    for (const [tex, unit] of [[maskTex, 0], [profileTex, 1]] as const) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    gl.uniform1i(uniforms.get('u_mask') ?? null, 0);
    gl.uniform1i(uniforms.get('u_profile') ?? null, 1);
  }
  return { gl, prog, uniforms, maskTex, profileTex };
}

function uploadConfig(p: Program, scene: SceneDef, config: SceneConfig, dpr: number): void {
  const { gl, uniforms } = p;
  for (const spec of [...scene.controls, ...STYLE_CONTROLS]) {
    if (!isUniform(spec)) continue;
    const location = uniforms.get(`u_${spec.key}`);
    if (!location) continue;
    const value = config[spec.key];
    if (spec.kind === 'color') gl.uniform3fv(location, hexToRgb(String(value)));
    else if (spec.kind === 'range' && !spec.int) gl.uniform1f(location, spec.key === 'cell' ? Number(value) * dpr : Number(value));
    else gl.uniform1i(location, Number(value) | 0);
  }
}

export function ShaderCanvas({ scene, config, anchorRef, onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const configRef = useRef(config);
  const invalidateRef = useRef<((geometry: boolean) => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const gl = canvas?.getContext('webgl2', { antialias: false, alpha: false });
    const program = gl && createProgram(gl, scene);
    if (!canvas || !host || !gl || !program) {
      onReady(false);
      return;
    }
    const loc = (name: string) => program.uniforms.get(name) ?? null;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let raf = 0;
    let visible = true;
    let lastTime = 0;
    let simTime = 0;
    let dpr = 1;
    let geometryDirty = true;
    let configDirty = true;
    let readyNotified = false;

    const applyGeometry = () => {
      const rect = canvas.getBoundingClientRect();
      const renderScale = Number(configRef.current.renderScale);
      dpr = Math.min(window.devicePixelRatio || 1, 2) * renderScale;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      canvas.classList.toggle(styles.pixelated, renderScale < 0.99);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(loc('u_res'), canvas.width, canvas.height);

      const anchor = anchorRef.current;
      if (!anchor) return;
      if (scene.anchorHorizon) {
        const bottom = (untransformedOffset(anchor, host).top + anchor.offsetHeight) / host.clientHeight;
        gl.uniform1f(loc('u_horizon'), 1 - bottom);
      }
      if (scene.textMask) {
        const mask = buildTextMask(anchor, host, canvas.width, canvas.height);
        if (!mask) return;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, program.maskTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mask.canvas);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, program.profileTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, canvas.width, 1, 0, gl.RGBA, gl.FLOAT, mask.profile);
        gl.uniform1f(loc('u_blockTop'), mask.blockTop);
        gl.uniform1f(loc('u_blockBottom'), mask.blockBottom);
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      simTime += dt;
      if (geometryDirty) { applyGeometry(); geometryDirty = false; }
      if (configDirty) { uploadConfig(program, scene, configRef.current, dpr); configDirty = false; }
      gl.uniform1f(loc('u_time'), simTime);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!readyNotified) { readyNotified = true; onReady(true); }
      if (!reduced) raf = requestAnimationFrame(frame);
    };
    const schedule = () => { if (!raf && visible) raf = requestAnimationFrame(frame); };

    const invalidate = (geometry: boolean) => {
      if (geometry) geometryDirty = true;
      configDirty = true;
      schedule();
    };
    invalidateRef.current = invalidate;

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => invalidate(true));
    resizeObserver?.observe(host);
    const intersection = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { lastTime = performance.now(); schedule(); }
    });
    intersection?.observe(host);

    // Fonts can land after mount; the mask must be built with the real display face.
    document.fonts?.ready.then(() => invalidate(true));
    schedule();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      intersection?.disconnect();
      invalidateRef.current = null;
      // No loseContext(): StrictMode re-runs this effect on the same canvas, and a lost
      // context cannot compile shaders again.
    };
  }, [scene, anchorRef, onReady]);

  // Config changes re-upload uniforms without rebuilding the program.
  useEffect(() => {
    const geometry = configRef.current.renderScale !== config.renderScale;
    configRef.current = config;
    invalidateRef.current?.(geometry);
  }, [config]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
