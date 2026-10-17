export type TextMask = {
  canvas: HTMLCanvasElement;
  /** Per column: [top, bottom, hasText, 1] with y normalized top-down. */
  profile: Float32Array;
  blockTop: number;
  blockBottom: number;
};

/** Position of `el` inside `host` ignoring CSS transforms (the entrance animation translates it). */
export function untransformedOffset(el: HTMLElement, host: HTMLElement): { left: number; top: number } {
  let left = 0;
  let top = 0;
  for (let node: HTMLElement | null = el; node && !node.contains(host); node = node.offsetParent as HTMLElement | null) {
    left += node.offsetLeft;
    top += node.offsetTop;
  }
  return { left, top };
}

/**
 * Rasterizes the rendered `<h1>` into a canvas that matches `host` pixel for pixel,
 * word by word, so wrapping and letter-spacing follow the DOM.
 */
export function buildTextMask(el: HTMLElement, host: HTMLElement, width: number, height: number): TextMask | null {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const textNode = el.firstChild;
  if (!ctx || !textNode || textNode.nodeType !== Node.TEXT_NODE) return null;

  const scale = width / host.getBoundingClientRect().width;
  const elRect = el.getBoundingClientRect();
  const origin = untransformedOffset(el, host);
  const cs = getComputedStyle(el);
  ctx.font = `${cs.fontWeight} ${parseFloat(cs.fontSize) * scale}px ${cs.fontFamily}`;
  ctx.letterSpacing = `${(parseFloat(cs.letterSpacing) || 0) * scale}px`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#fff';

  const text = textNode.textContent ?? '';
  const range = document.createRange();
  for (const match of text.matchAll(/\S+/g)) {
    range.setStart(textNode, match.index);
    range.setEnd(textNode, match.index + match[0].length);
    const rect = range.getBoundingClientRect();
    const ascent = ctx.measureText(match[0]).fontBoundingBoxAscent;
    const x = origin.left + (rect.left - elRect.left);
    const y = origin.top + (rect.top - elRect.top);
    ctx.fillText(match[0], x * scale, y * scale + ascent);
  }

  const data = ctx.getImageData(0, 0, width, height).data;
  const profile = new Float32Array(width * 4);
  let blockTop = height;
  let blockBottom = 0;
  for (let x = 0; x < width; x++) {
    let top = -1;
    let bottom = -1;
    for (let y = 0; y < height; y++) {
      if (data[(y * width + x) * 4 + 3] > 100) { top = y; break; }
    }
    if (top >= 0) {
      for (let y = height - 1; y >= top; y--) {
        if (data[(y * width + x) * 4 + 3] > 100) { bottom = y; break; }
      }
      blockTop = Math.min(blockTop, top);
      blockBottom = Math.max(blockBottom, bottom);
    }
    profile[x * 4] = top >= 0 ? top / height : 0;
    profile[x * 4 + 1] = bottom >= 0 ? bottom / height : 0;
    profile[x * 4 + 2] = top >= 0 ? 1 : 0;
    profile[x * 4 + 3] = 1;
  }
  if (blockTop >= blockBottom) return null;
  return { canvas, profile, blockTop: blockTop / height, blockBottom: blockBottom / height };
}
