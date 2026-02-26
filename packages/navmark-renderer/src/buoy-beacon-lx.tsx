import type { CompositeSvg, Dimensions, Tags } from './util/types.def.js';
import {
  STRUCTURES,
  STRUCTURE_MAP,
  createStructure,
  isStructure,
} from './components/structures.js';
import { createLightDroplet } from './components/lights.js';
import { createFogSignal } from './components/fog-signal.js';
import { COLOUR_OVERRIDES } from './components/colours.js';
import { createTopmark, isTopmarkShape } from './components/topmarks.js';
import { svgToRaster } from './util/svgToRaster.js';
import { isColourPattern } from './components/colour-pattern.js';
import { svgToString } from './util/svgToString.js';

export function BuoyBeaconLxComponent(tags: Tags): CompositeSvg & Dimensions {
  let type = tags['seamark:type'];

  // if the type is light, replace it with the real structure
  if (type?.startsWith('light_')) {
    for (const key in tags) {
      if (/^seamark:(beacon|buoy)_/.test(key)) {
        type = key.split(':')[1];
      }
    }
  }

  const _shape = tags[`seamark:${type}:shape`]!;
  let structureShape = isStructure(_shape) ? _shape : STRUCTURE_MAP[_shape];
  // fallback to the most generic shape from each category
  if (!structureShape && type?.startsWith('beacon_')) structureShape = 'pile';
  if (!structureShape && type?.startsWith('buoy_')) structureShape = 'pillar';
  structureShape ||= 'none'; // lastly, fallback to no structure (e.g. lone daymarks or lights)

  let structureColourPattern = tags[`seamark:${type}:colour_pattern`];
  const structureColour = tags[`seamark:${type}:colour`]?.split(';') || [];

  if (
    _shape === 'lattice' &&
    (!structureColourPattern || structureColour.length === 1)
  ) {
    // lattice has an implied colour pattern
    structureColourPattern = 'saltire';
    structureColour.push('#555');
  }

  const structure = createStructure(
    structureShape,
    structureColour.map((c) => COLOUR_OVERRIDES[c] || c),
    isColourPattern(structureColourPattern)
      ? structureColourPattern
      : undefined,
  );
  const topmarkShape =
    tags['seamark:topmark:shape'] || tags['seamark:daymark:shape'];
  const topmarkColourPattern =
    tags['seamark:topmark:colour_pattern'] ||
    tags['seamark:daymark:colour_pattern'];
  const topmark = isTopmarkShape(topmarkShape)
    ? createTopmark(
        topmarkShape,
        (tags['seamark:topmark:colour'] || tags['seamark:daymark:colour'])
          ?.split(';')
          .map((c) => COLOUR_OVERRIDES[c] || c) || [],
        isColourPattern(topmarkColourPattern)
          ? topmarkColourPattern
          : undefined,
      )
    : undefined;

  const lightColour =
    tags['seamark:light:colour']
      ?.split(';')
      .map((c) => COLOUR_OVERRIDES[c] || c) || [];
  const light =
    lightColour?.length || tags['seamark:light:1:colour']
      ? createLightDroplet(lightColour.join(';'))
      : undefined;

  const fogSignal = tags['seamark:fog_signal:category']
    ? createFogSignal()
    : undefined;

  // the topmark might need to be rotated and translated so
  // that it sits exactly on top of the structure.
  const topmarkTransform = STRUCTURES[structureShape][2];

  const svg = (
    <>
      {topmark && <g style={`transform:${topmarkTransform}`}>{topmark.svg}</g>}
      {structure && (
        <g style="transform:translate(5px, 11px)">{structure.svg}</g>
      )}
      {light && <g style="transform:translate(5px, 2px)">{light.svg}</g>}
      {fogSignal?.svg && (
        <g style="transform:translate(8px, 10px)">{fogSignal.svg}</g>
      )}
    </>
  );
  const defs = { ...structure?.defs, ...topmark?.defs, ...light?.defs };

  return { defs, svg, width: 20, height: 40 };
}

export async function renderBuoyBeaconLx(
  tags: Tags,
): Promise<ImageData | undefined> {
  const { svg, defs, width, height } = BuoyBeaconLxComponent(tags);

  const scale = 2 * (window.devicePixelRatio || 2);

  const final = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={width * scale}
      height={height * scale}
    >
      {defs && <defs>{Object.values(defs)}</defs>}
      {svg}
    </svg>
  );

  return svgToRaster(svgToString(final), {
    width: width * scale,
    height: height * scale,
  });
}
