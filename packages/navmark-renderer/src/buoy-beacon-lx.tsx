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
import {
  VAtoN_TOPMARKS,
  createTopmark,
  isTopmarkShape,
} from './components/topmarks.js';
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

  /* eslint-disable dot-notation */
  if (!type && tags['man_made'] === 'lighthouse') {
    type = 'beacon_special_purpose';
    structureShape = 'tower';
  }
  if (!type && tags['man_made'] === 'offshore_platform') type = 'platform';

  // fallback to the most generic shape from each category
  if (!structureShape && type?.startsWith('beacon_')) structureShape = 'pile';
  if (!structureShape && type?.startsWith('buoy_')) structureShape = 'pillar';
  if (!structureShape && type?.startsWith('light_')) structureShape = 'lx';

  if (type === 'mooring' && tags['seamark:mooring:category'] === 'buoy') {
    structureShape ||= 'spherical'; // mooring:* is a confusing and orthogonal set of tags.
  }

  structureShape ||= 'none'; // lastly, fallback to no structure (e.g. lone daymarks or lights)

  let structureColourPattern = tags[`seamark:${type}:colour_pattern`];
  const structureColour = tags[`seamark:${type}:colour`]?.split(';') || [];
  if (structureShape === 'lx' && !structureColour.length) {
    structureColour.push('#000');
  }

  if (
    _shape === 'lattice' &&
    (!structureColourPattern || structureColour.length === 1)
  ) {
    // lattice has an implied colour pattern
    structureColourPattern = 'saltire';
    structureColour.push('#555');
  }
  if (type === 'virtual_aton') structureShape = type;

  const structure = createStructure(
    structureShape,
    structureColour.map((c) => COLOUR_OVERRIDES[c] || c),
    isColourPattern(structureColourPattern)
      ? structureColourPattern
      : undefined,
  );
  const topmarkShape =
    tags['seamark:topmark:shape'] ||
    tags['seamark:daymark:shape'] ||
    (type === 'virtual_aton'
      ? VAtoN_TOPMARKS[tags['seamark:virtual_aton:category']!]
      : undefined);

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
        structure.transform.rotate,
      )
    : undefined;

  const lightColour =
    tags['seamark:light:colour']
      ?.split(';')
      .map((c) => COLOUR_OVERRIDES[c] || c) || [];
  const light =
    lightColour?.length || tags['seamark:light:1:colour']
      ? createLightDroplet(lightColour.length === 1 ? lightColour[0]! : '#f0f')
      : undefined;

  const fogSignal = tags['seamark:fog_signal:category']
    ? createFogSignal()
    : undefined;

  // the topmark might need to be rotated and translated so
  // that it sits exactly on top of the structure.
  const { translateX, translateY, rotate } = STRUCTURES[structureShape][2];
  const topmarkTransform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`;

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
  scale: number,
): Promise<ImageData | undefined> {
  const { svg, defs, width, height } = BuoyBeaconLxComponent(tags);

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
