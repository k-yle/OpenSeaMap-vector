import { describe, expect, it } from 'vitest';

import type { Defs } from '../util/types.def.js';
import {
  TOPMARK_SHAPES,
  type TopmarkShape,
  createTopmark,
} from '../components/topmarks.js';
import {
  COLOUR_PATTERNS,
  type ColourPattern,
} from '../components/colour-pattern.js';
import { svgToString } from '../util/svgToString.js';

const TEST_COLOURS = ['#fa003f', '#1390ff', '#fc0', '#14b814'];

describe(createTopmark, () => {
  function createTopmarkTestCard(count: number) {
    const patterns = Object.keys(COLOUR_PATTERNS) as (
      | ColourPattern
      | undefined
    )[];
    const shapes = Object.keys(TOPMARK_SHAPES) as TopmarkShape[];
    patterns.push(undefined);

    const defs: Defs = {};
    const out: React.ReactNode[] = [];

    for (const [x, shape] of shapes.entries()) {
      for (const [y, pattern] of patterns.entries()) {
        const colours = TEST_COLOURS.slice(0, count);
        const result = createTopmark(shape, colours, pattern);
        Object.assign(defs, result.defs);
        out.push(
          <g transform={`translate(${(x + 1) * 10}, ${(y + 1) * 10})`}>
            {result.svg}
          </g>,
        );
      }
    }

    const width = (shapes.length + 1) * 10;
    const height = (patterns.length + 1) * 10;

    const final = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>{Object.values(defs)}</defs>
        <rect x={0} y={0} width={width} height={height} fill="#fff" />
        {shapes.map((shape, x) => (
          <text
            x={(x + 1.5) * 10}
            y={5}
            fill="#000"
            text-anchor="middle"
            font-style="bold"
            font-size={1}
            font-family="sans-serif"
          >
            {shape || 'none'}
          </text>
        ))}
        {patterns.map((pattern, y) => (
          <text
            x={5}
            y={(y + 1.5) * 10}
            fill="#000"
            text-anchor="middle"
            font-style="bold"
            font-size={1}
            font-family="sans-serif"
          >
            {pattern || 'none'}
          </text>
        ))}
        {out}
      </svg>
    );

    return svgToString(final);
  }

  it('generates a snapshot for topmarks with 0 colours', () => {
    expect(createTopmarkTestCard(0)).toMatchFileSnapshot('topmark0.svg');
  });

  it('generates a snapshot for topmarks with 1 colours', () => {
    expect(createTopmarkTestCard(1)).toMatchFileSnapshot('topmark1.svg');
  });

  it('generates a snapshot for topmarks with 2 colours', () => {
    expect(createTopmarkTestCard(2)).toMatchFileSnapshot('topmark2.svg');
  });

  it('generates a snapshot for topmarks with 3 colours', () => {
    expect(createTopmarkTestCard(3)).toMatchFileSnapshot('topmark3.svg');
  });

  it('generates a snapshot for topmarks with 4 colours', () => {
    expect(createTopmarkTestCard(4)).toMatchFileSnapshot('topmark4.svg');
  });
});
