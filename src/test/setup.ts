import '@testing-library/jest-dom/vitest';

// jsdom has no canvas: return null so WebGL code takes its fallback path quietly.
HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;
