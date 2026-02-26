import { describe, expect, it } from 'vitest';
import { STRUCTURES, type Structure } from '../components/structures.js';
import type { Defs, Tags } from '../util/types.def.js';
import { TOPMARK_SHAPES, type TopmarkShape } from '../components/topmarks.js';
import { BuoyBeaconLxComponent } from '../buoy-beacon-lx.js';
import { svgToString } from '../util/svgToString.js';

function render(tags: Tags) {
  const { svg, defs, width, height } = BuoyBeaconLxComponent(tags);
  return svgToString(
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${height}`}>
      {defs && <defs>{Object.values(defs)}</defs>}
      {svg}
    </svg>,
  );
}

const crazyColours: Tags = {
  'seamark:type': 'beacon_special_purpose',
  'seamark:beacon_special_purpose:shape': 'pile',
  'seamark:beacon_special_purpose:colour': 'yellow;violet',
  'seamark:beacon_special_purpose:colour_pattern': 'vertical',
  'seamark:topmark:shape': '2 cones base together',
  'seamark:topmark:colour': 'red;blue',
  'seamark:light:colour': 'green',
  'seamark:fog_signal:category': 'horn',
};

describe(BuoyBeaconLxComponent, () => {
  it('buoy-beacon-lx-1.svg', () => {
    const svg = render(crazyColours);
    expect(svg).toMatchFileSnapshot('buoy-beacon-lx-1.svg');
  });

  it('generates a test card for every combination of structure + topmark', () => {
    const structures = Object.keys(STRUCTURES) as Structure[];
    const topmarks = Object.keys(TOPMARK_SHAPES) as (
      | TopmarkShape
      | undefined
    )[];
    topmarks.push(undefined);

    const defs: Defs = {};
    const out: React.ReactNode[] = [];

    const [BOX_WIDTH, BOX_HEIGHT] = [20, 25];

    for (const [x, shapeId] of topmarks.entries()) {
      for (const [y, structureId] of structures.entries()) {
        const colour = `hsl(${2 * (10 * x + y)} 80% 40%)`;

        const tags: Tags = {
          'seamark:type': 'beacon_special_purpose',
          'seamark:beacon_special_purpose:shape': structureId,
          'seamark:beacon_special_purpose:colour': colour,
        };
        if (shapeId) {
          tags['seamark:topmark:shape'] = shapeId;
          tags['seamark:topmark:colour'] = colour;
        }

        const { svg: merged, defs: newDefs } = BuoyBeaconLxComponent(tags);

        Object.assign(defs, newDefs);
        out.push(
          <g
            transform={`translate(${(x + 1) * BOX_WIDTH}, ${(y + 1) * BOX_HEIGHT})`}
          >
            {merged}
          </g>,
        );
      }
    }

    const width = (topmarks.length + 1) * BOX_WIDTH;
    const height = (structures.length + 1) * BOX_HEIGHT;

    const final = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>{Object.values(defs)}</defs>
        <rect x={0} y={0} width={width} height={height} fill="#fff" />
        {topmarks.map((shape, x) => (
          <text
            x={(x + 1.5) * BOX_WIDTH}
            y={BOX_HEIGHT / 2 + ((x % 2 ? 1 : -1) * BOX_HEIGHT) / 4}
            fill="#000"
            text-anchor="middle"
            font-style="bold"
            font-size={3}
            font-family="sans-serif"
          >
            {shape || 'none'}
          </text>
        ))}
        {structures.map((pattern, y) => (
          <text
            x={BOX_WIDTH / 2}
            y={(y + 1.5) * BOX_HEIGHT}
            fill="#000"
            text-anchor="middle"
            font-style="bold"
            font-size={3}
            font-family="sans-serif"
          >
            {pattern || 'none'}
          </text>
        ))}
        {out}
      </svg>
    );

    expect(svgToString(final)).toMatchFileSnapshot(
      'topmark-structure-matrix.svg',
    );
  });
});
