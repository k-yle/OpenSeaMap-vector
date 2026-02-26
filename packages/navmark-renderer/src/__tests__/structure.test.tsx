import { describe, expect, it } from 'vitest';
import {
  STRUCTURES,
  type Structure,
  createStructure,
} from '../components/structures.js';

import type { Defs } from '../util/types.def.js';
import {
  COLOUR_PATTERNS,
  type ColourPattern,
} from '../components/colour-pattern.js';
import { svgToString } from '../util/svgToString.js';

const TEST_COLOURS = ['#fa003f', '#1390ff', '#fc0', '#14b814'];

describe(createStructure, () => {
  function createStructureTestCard(count: number) {
    const patterns = Object.keys(COLOUR_PATTERNS) as (
      | ColourPattern
      | undefined
    )[];
    patterns.push(undefined);
    const structures = Object.keys(STRUCTURES) as Structure[];

    const defs: Defs = {};
    const out: React.ReactNode[] = [];

    for (const [x, structure] of structures.entries()) {
      for (const [y, pattern] of patterns.entries()) {
        const colours = TEST_COLOURS.slice(0, count);

        const result = createStructure(structure, colours, pattern);
        Object.assign(defs, result.defs);
        out.push(
          <g transform={`translate(${(x + 1) * 10}, ${(y + 1) * 10})`}>
            {result.svg}
          </g>,
        );
      }
    }

    const width = (structures.length + 1) * 10;
    const height = (patterns.length + 1) * 10;

    const final = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>{Object.values(defs)}</defs>
        <rect x={0} y={0} width={width} height={height} fill="#fff" />
        {structures.map((shape, x) => (
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

  it('generates a snapshot for structures with 0 colours', () => {
    expect(createStructureTestCard(0)).toMatchFileSnapshot('structure0.svg');
  });

  it('generates a snapshot for structures with 1 colours', () => {
    expect(createStructureTestCard(1)).toMatchFileSnapshot('structure1.svg');
  });

  it('generates a snapshot for structures with 2 colours', () => {
    expect(createStructureTestCard(2)).toMatchFileSnapshot('structure2.svg');
  });

  it('generates a snapshot for structures with 3 colours', () => {
    expect(createStructureTestCard(3)).toMatchFileSnapshot('structure3.svg');
  });

  it('generates a snapshot for structures with 4 colours', () => {
    expect(createStructureTestCard(4)).toMatchFileSnapshot('structure4.svg');
  });
});
