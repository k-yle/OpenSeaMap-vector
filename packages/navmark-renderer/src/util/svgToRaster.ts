import type { Dimensions } from './types.def.js';

// @ts-expect-error --  polyfill for safari
Symbol.dispose ||= Symbol('dispose');

export async function svgToCanvas(svg: string, { width, height }: Dimensions) {
  // svg -> blob
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const blobUrl = URL.createObjectURL(blob);

  // blob -> image
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.addEventListener('load', resolve);
    img.addEventListener('error', reject);
    img.src = blobUrl;
  });

  // image -> canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  URL.revokeObjectURL(blobUrl);
  img.remove();

  return Object.assign(ctx, {
    [Symbol.dispose]: () => canvas.remove(),
  });
}

export async function svgToRaster(svg: string, dimensions: Dimensions) {
  using ctx = await svgToCanvas(svg, dimensions);

  // canvas -> png
  const pixelBuffer = ctx.getImageData(
    0,
    0,
    ctx.canvas.width,
    ctx.canvas.height,
  );

  return pixelBuffer;
}
