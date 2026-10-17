import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { createRef } from 'react';
import { ShaderCanvas } from './ShaderCanvas';
import { horizon } from './scenes/horizon';
import { shore } from './scenes/shore';
import { buildFragmentSource } from './scenes/shared';

describe('ShaderCanvas', () => {
  it('reports not ready when WebGL2 is unavailable (jsdom)', () => {
    const onReady = vi.fn();
    const anchorRef = createRef<HTMLHeadingElement>();
    const { container } = render(
      <div>
        <ShaderCanvas scene={horizon} config={horizon.defaults} anchorRef={anchorRef} onReady={onReady} />
      </div>,
    );
    expect(container.querySelector('canvas')).toHaveAttribute('aria-hidden', 'true');
    expect(onReady).toHaveBeenCalledWith(false);
  });
});

describe('buildFragmentSource', () => {
  it('declares one uniform per shader control and the shared style uniforms', () => {
    for (const def of [horizon, shore]) {
      const src = buildFragmentSource(def);
      expect(src).toContain('uniform float u_cell;');
      expect(src).toContain('uniform int u_style;');
      expect(src).toContain('uniform vec3 u_pal0;');
      expect(src).toContain('vec3 scene(vec2 fc)');
      for (const spec of def.controls) {
        const declared = src.includes(`u_${spec.key};`);
        expect(declared, `${def.id}: u_${spec.key}`).toBe(spec.uniform !== false);
      }
    }
  });
});
