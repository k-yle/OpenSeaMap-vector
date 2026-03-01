export interface TextConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  fontWeight?: number;
  fontFamily?: string;
}

const DEFAULT_FONT_FAMILY =
  '"sans-serif-condensed", "Arial Narrow", sans-serif';

const DEFAULT_FONT_WEIGHT = 500;

const DEBUG = false;

/**
 * A fairly crude way of rendering text on a canvas within
 * the bounds of a rectangular box.
 *
 * Based on {@link https://github.com/hiddewie/OpenRailwayMap-vector/blob/c6d195c8/proxy/js/ui.js#L821-L850}
 *
 * @returns nothing, mutates `ctx` instead.
 */
export function renderTextWithinBbox(
  ctx: CanvasRenderingContext2D,
  text: string,
  config: TextConfig,
) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  // start with a font-size that is probably too large
  let size = Math.max(config.width, config.height);

  // then loop until we find a font-size that fits the bbox
  let measured: TextMetrics;
  do {
    size /= 1.05; // decrease by 5% each time, until we find a suitable size

    ctx.font = [
      'condensed',
      config.fontWeight ?? DEFAULT_FONT_WEIGHT,
      `${size}px`,
      config.fontFamily ?? DEFAULT_FONT_FAMILY,
    ].join(' ');

    measured = ctx.measureText(text);
  } while (
    // while the text is too big
    measured.width > config.width ||
    measured.actualBoundingBoxDescent > config.height
  );

  /** midway */
  const anchorX = config.x + config.width / 2;

  // needs to consider the different in height between the bbox and
  // the actual text height, so that the text is vertically centered
  const anchorY =
    config.y + (config.height - measured.actualBoundingBoxDescent) / 2;

  if (DEBUG) {
    const padding = 2;
    ctx.strokeStyle = '#00f';
    ctx.lineWidth = 2;
    ctx.strokeRect(config.x, config.y, config.width, config.height);
    ctx.fillStyle = '#0f0';
    ctx.fillRect(
      anchorX - padding,
      anchorY - padding,
      2 * padding,
      2 * padding,
    );
  }

  ctx.fillStyle = config.color;
  ctx.fillText(text, anchorX, anchorY);
}
