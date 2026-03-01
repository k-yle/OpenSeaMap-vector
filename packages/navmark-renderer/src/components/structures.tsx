import type { CompositeSvg, Transform } from '../util/types.def.js';
import { type ColourPattern, createPattern } from './colour-pattern.js';

/** map OSM tags which are synonyms of more common structures */
export const STRUCTURE_MAP: Record<string, Structure> = {
  stake: 'pole',
  perch: 'pole',
  post: 'pole',
  lattice: 'tower',
  buoyant: 'pile',
  ice_buoy: 'super-buoy',
};

export const STRUCTURES = {
  // beacons
  tower: [
    'M6 9C6 10 4 10 4 9L0 9 0 8.5 1 8.5 2 1 2 0 8 0 8 1 9 8.5 10 8.5 10 9ZM6 9C6 8 4 8 4 9 4 10 6 10 6 9Z',
    0.3,
    { translateX: 5, translateY: 2, rotate: 0 },
  ],
  pile: [
    'M6 9C6 10 4 10 4 9L1 9 1 8.5 4 8.5 4 0 6 0 6 8.5 9 8.5 9 9ZM6 9C6 8 4 8 4 9 4 10 6 10 6 9Z',
    0.3,
    { translateX: 5, translateY: 2, rotate: 0 },
  ],
  pole: ['M4.75 9V0h.5V9Z', 0.1, { translateX: 5, translateY: 2, rotate: 0 }],
  // TODO: also withy and cairn

  // buoys
  conical: [
    'M5.0063 8.2469c-.414 0-.75.336-.75.75s.336.75.75.75c.4139 0 .75-.336.75-.75s-.3361-.75-.75-.75ZM6.3594 5.2406ZM6.6 4.5313v.0093c1.2999.9961 2.0322 2.5541 1.9781 4.175h.6282V9.275v.0063H6.2219c-.1285.5535-.6231.9656-1.2156.9656-.5923 0-1.0869-.4123-1.2157-.9656H.8219V8.7156h.7812C2.0236 6.302 4.1343 4.522 6.6 4.5313Z',
    0.3,
    { translateX: 10, translateY: 5, rotate: 20 },
  ],
  can: [
    'M3.1418 4.1416 1.6199 8.7166H.823V9.2822H3.7918C3.9205 9.8355 4.4151 10.2478 5.0074 10.2478 5.5999 10.2478 6.0945 9.8357 6.223 9.2822H9.2074V9.2759 8.7165H8.4386L9.3386 6.0977ZM5.0074 8.2479C5.4214 8.2479 5.7574 8.5839 5.7574 8.9979 5.7574 9.4119 5.4214 9.7479 5.0074 9.7479 4.5934 9.7479 4.2574 9.4119 4.2574 8.9979 4.2574 8.5839 4.5934 8.2479 5.0074 8.2479Z',
    0.3,
    { translateX: 10, translateY: 5, rotate: 20 },
  ],
  spherical: [
    'M5.0094 8.2469c-.414 0-.75.336-.75.75s.336.75.75.75c.414 0 .75-.336.75-.75s-.336-.75-.75-.75ZM5.5 4.3656c1.1247.0034 2.2053.6228 2.7813 1.6.4864.8254.5759 1.852.2624 2.75h.6657V9.275v.0062H6.225c-.1285.5536-.6231.9657-1.2156.9657-.5923 0-1.0869-.4124-1.2156-.9657L1.5969 9.2781V8.7156h.8406c-.316-.9044-.2229-1.9375.2719-2.7656C3.2912 4.9763 4.3753 4.3622 5.5 4.3656Z',
    0.3,
    { translateX: 10, translateY: 5, rotate: 20 },
  ],
  pillar: [
    'm8.899.65L7.1272.0812 4.454 5.4538 1.4759 8.7132H.6978l-.0125.5656H3.7915c.1287.5533.6233.9657 1.2156.9657.5925 0 1.0871-.4121 1.2156-.9657H8.6352V8.7132H7.857L7.6102 6.4788ZM5.7559 8.9956c0 .414-.336.75-.75.75-.414 0-.75-.336-.75-.75s.336-.75.75-.75c.414 0 .75.336.75.75Z',
    0.3,
    { translateX: 11.7, translateY: 0.2, rotate: 20 },
  ],
  spar: [
    'M4.9995 8.2476c-.414 0-.75.336-.75.75s.336.75.75.75.75-.336.75-.75-.336-.75-.75-.75ZM7.008.226l1.721.602L6.163 8.516c.028.047.047.1.0521.2004l.8313-.0031v.5656l-.8313.0031c-.1285.5535-.6231.9656-1.2156.9656-.5923 0-1.0869-.4123-1.2156-.9656H2.9276l.0125-.5656h.8438c.1068-.4604.3711-.7134.6221-.7984Z',
    0.3,
    { translateX: 11.7, translateY: 0.2, rotate: 20 },
  ],
  barrel: [
    'M1 8.74A3.6 1.8 90 012.62 5.5a3.6 1.8 90 01.99 3.24Zm2.7 0A3.6 1.8 90 002.7 5.5a4.5 1.35 0 015.14 0A3.6 1.8 90 019.37 8.74v.5359.0063H6.223c-.1285.5535-.6231.9656-1.2156.9656-.5923 0-1.0869-.4123-1.2156-.9656H.823V8.74Zm1.3074-.4921c-.414 0-.75.336-.75.75s.336.75.75.75c.414 0 .75-.336.75-.75s-.336-.75-.75-.75Z',
    0.3,
    { translateX: 5, translateY: 6.5, rotate: 0 },
  ],
  'super-buoy': [
    'M3.6844 4.5156 3 6H2L0 5.0688l1.0781 3.65H0v.5625l3.7938.0062c.2062.5533.6233.9719 1.2156.9719.5925 0 1.0902-.4183 1.2187-.9719L10 9.2844V8.7188H8.9L10 5 8 6H7L6.3656 4.5156H3.6844Zm1.325 3.7438c.414 0 .75.336.75.75s-.336.75-.75.75-.75-.336-.75-.75.336-.75.75-.75Z',
    0.3,
    { translateX: 5, translateY: 5.5, rotate: 0 },
  ],

  // other
  none: [
    'M6 9C6 10 4 10 4 9 4 8 6 8 6 9Z',
    0.3,
    { translateX: 5, translateY: 9.5, rotate: 0 },
  ],
} satisfies Record<
  string,
  [path: string, strokeWidth: number, transform: Transform]
>;
export type Structure = keyof typeof STRUCTURES;

export const isStructure = (str: string | undefined): str is Structure =>
  !!str && str in STRUCTURES;

export function createStructure(
  structure: Structure,
  colours: string[],
  colourPattern: ColourPattern | undefined,
): CompositeSvg & { transform: Transform } {
  const [path, strokeWidth, transform] = STRUCTURES[structure];

  if (colourPattern) {
    const { patternId, pattern } = createPattern(
      colours,
      colourPattern,
      transform.rotate,
    );
    const svg = (
      <path
        d={path}
        fill={`url(#${patternId})`}
        stroke="#000"
        stroke-width={strokeWidth}
      />
    );
    return { svg, defs: { [patternId]: pattern }, transform };
  }

  // no colour pattern - just a single colour, solid fill.
  const svg = (
    <path
      d={path}
      fill={colours[0] || 'none'}
      stroke="#000"
      stroke-width={strokeWidth}
    />
  );
  return { svg, transform };
}
