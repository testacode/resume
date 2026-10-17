export type SceneId = 'horizon' | 'shore';
export type SceneChoice = SceneId | 'random';

export type SceneConfig = Record<string, number | string>;

export type ControlSpec =
  | {
      kind: 'range';
      key: string;
      label: string;
      group: string;
      min: number;
      max: number;
      step: number;
      /** Upload as `int` uniform instead of `float`. */
      int?: boolean;
      /** Not a shader uniform (layout / text / render settings). */
      uniform?: false;
    }
  | { kind: 'check'; key: string; label: string; group: string; uniform?: false }
  | { kind: 'color'; key: string; label: string; group: string; uniform?: false }
  | {
      kind: 'select';
      key: string;
      label: string;
      group: string;
      options: ReadonlyArray<readonly [number, string]>;
      uniform?: false;
    };

export type SceneDef = {
  id: SceneId;
  label: string;
  /** GLSL body defining `vec3 scene(vec2 fc)`; uniforms come from `controls`. */
  body: string;
  controls: ReadonlyArray<ControlSpec>;
  defaults: SceneConfig;
  presets: Record<string, SceneConfig>;
  /** Shore: rasterize the `<h1>` into a mask so waves break on the letters. */
  textMask?: boolean;
  /** Horizon: `u_horizon` follows the bottom edge of the `<h1>`. */
  anchorHorizon?: boolean;
};
