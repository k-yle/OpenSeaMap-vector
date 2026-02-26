import type { CompositeSvg } from '../util/types.def.js';
import { circle } from './circle.js';
import { type ColourPattern, createPattern } from './colour-pattern.js';

/**
 * - If the array has 1 item, then `colour_pattern`s are applied
 *   as a `<pattern />` across the whole path.
 * - If the array has >1 item, then the `colour_pattern` is
 *   applied seperately to each sub-path.
 *
 * Must fit within 10x10 px
 */
export const TOPMARK_SHAPES = {
  'cone, point up': ['M5 4 2.5 8 7.5 8Z'], // TODO: 3d cone ?
  'cone, point down': ['M5 8 2.5 4 7.5 4Z'], // TODO: 3d cone ?
  sphere: [circle(5, 6.5, 2)],
  '2 spheres': [circle(5, 2.5, 2), circle(5, 6.5, 2)],
  cylinder: [
    'M2.5 5A2.5.5 0 007.5 5 2.5.5 0 002.5 5L2.5 7.92A2.5.5 0 007.5 7.92L7.5 5',
  ],
  board: ['M3 8V3H7V8Z'],
  'x-shape': [
    'M2.8787 4.5858 3.5858 3.8787 5 5.2929 6.4142 3.8787 7.1213 4.5858 5.7071 6 7.1213 7.4142 6.4142 8.1213 5 6.7071 3.5858 8.1213 2.8787 7.4142 4.2929 6Z',
  ],
  cross: ['M2.5 6.5V5.5H4.5V3.5H5.5V5.5H7.5V6.5H5.5V8.5H4.5V6.5Z'],
  // cube, point up
  '2 cones point together': ['M5 4 7.5 0 2.5 0Z', 'M5 4 2.5 8 7.5 8Z'],
  '2 cones base together': ['M5 0 7.5 4 2.5 4Z', 'M5 8 2.5 4 7.5 4Z'],
  rhombus: ['M2.1716 6 5 3.1716 7.8284 6 5 8.8284Z'],
  '2 cones up': ['M5 0 7.5 4 2.5 4Z', 'M5 4 2.5 8 7.5 8Z'],
  '2 cones down': ['M5 4 7.5 0 2.5 0Z', 'M5 8 2.5 4 7.5 4Z'],
  'besom, point up': [
    'M4.5 8 4.5 5 3.6 5.9 2.96 5.34 5 3.3 7.04 5.34 6.4 5.9 5.53 5 5.5 8Z',
  ],
  'besom, point down': [
    'M5 5.5 3.6 4.1 3 4.7 4.5 6.2 4.5 8 5.5 8 5.5 6.2 7 4.7 6.4 4.1Z',
  ],
  flag: [
    'M4.7 8V2C5.23 1.374 5.993 1.374 6.704 2 7.461 2.774 8.121 2.706 8.839 1.983V4.276C8.121 4.994 7.541 4.914 6.846 4.276 6.095 3.548 5.776 3.753 5.3 4.258V8Z',
  ],
  // sphere over rhombus
  square: ['M3 8V4H7V8Z'],
  // rectangle, horizontal
  // rectangle, vertical
  // trapezium, up
  // trapezium, down
  'triangle, point up': ['M5 4 2.5 8 7.5 8Z'],
  'triangle, point down': ['M5 8 2.5 4 7.5 4Z'],
  // circle
  // 2 upright crosses
  // t-shape
  // triangle, point up over circle
  // upright cross over circle
  // rhombus over circle
  // circle over triangle, point up
  // other
} satisfies Record<string, string[]>;
export type TopmarkShape = keyof typeof TOPMARK_SHAPES;

export const isTopmarkShape = (str: string | undefined): str is TopmarkShape =>
  !!str && str in TOPMARK_SHAPES;

export function createTopmark(
  shape: TopmarkShape,
  colours: string[],
  colourPattern: ColourPattern | undefined,
): CompositeSvg {
  const path = TOPMARK_SHAPES[shape];

  const mast = <rect x="4.5" y="7" width="1" height="3" fill="#999" />;

  if (colourPattern) {
    const { patternId, pattern } = createPattern(colours, colourPattern);
    const svg = path.map((p) => (
      <path
        d={p}
        fill={`url(#${patternId})`}
        stroke="#000"
        stroke-width={0.3}
      />
    ));
    return { svg: [mast, svg], defs: { [patternId]: pattern } };
  }

  // no colour pattern - just a single colour, solid fill.
  const svg = path.map((p, i) => (
    <path
      d={p}
      fill={colours[i] || colours[0] || 'none'}
      stroke="#000"
      stroke-width={0.3}
    />
  ));
  return { svg: [mast, svg] };
}
