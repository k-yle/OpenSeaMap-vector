import type { ExpressionSpecification, StyleSpecification } from 'maplibre-gl';
// eslint-disable-next-line import-x/no-absolute-path -- this is vite magic
import styleJsonUrl from '/style.json?url';
import type styleJsonType from '../../../data/public/style.json';

const isLocalhost = window.location.hostname === 'localhost';

const CDN_BASE_URL = isLocalhost
  ? `${window.location.origin}/OpenSeaMap-vector`
  : 'https://cdn-oceania-07.kyle.kiwi';

const SELF_BASE_URL = isLocalhost
  ? CDN_BASE_URL
  : 'https://kyle.kiwi/OpenSeaMap-vector';

export const PMTILES_URL = `${CDN_BASE_URL}/seamarks.pmtiles`;

export const SCALE = globalThis.devicePixelRatio || 2;

/**
 * walks thru nested arrays in an expression with BFS, emitting
 * everything that it encounters.
 */
export function* walkExpression(expression: unknown): Generator<unknown> {
  yield expression;
  if (Array.isArray(expression)) {
    for (const item of expression) {
      yield* walkExpression(item);
    }
  }
}

export async function getStyle() {
  const styleJson: typeof styleJsonType = await fetch(styleJsonUrl).then((r) =>
    r.json(),
  );

  styleJson.sources.seamarks.url = `pmtiles://${PMTILES_URL}`;
  styleJson.sprite[0]!.url = `${SELF_BASE_URL}/icons`;

  // remove the disclaimer, since we know that in the navbar instead
  styleJson.sources.basemap.attribution =
    styleJson.sources.basemap.attribution.split(' &middot; ')[0]!;

  /**
   * override the placeholder symbol that we will replace
   * with a complex symbol via styleimagemissing.
   *
   * The icon-image is replaced with a massive string
   * that we can parse later with {@link URLSearchParams}.
   */
  const ALL_ATTRIBUTES = [
    'addition',
    'category',
    'channel',
    'colour_pattern',
    'colour',
    'condition',
    'construction',
    'distance_down',
    'distance_end',
    'distance_start',
    'distance_up',
    'frequency',
    'function',
    'generation',
    'group',
    'height',
    'impact',
    'information',
    'period',
    'product',
    'range',
    'reflectivity',
    'sequence',
    'shape',
    'system',
    'visibility',
  ];

  const ARRAY_KEYS = new Set(['notice', 'light']);

  const ALL_KEYS = [
    'seamark:type',
    'seamark:name',

    'man_made', // fallback for lighthouse and offshore_platform

    // required for notice marks:
    'maxspeed',
    'maxheight',
    'maxwidth',
    'maxdraft',
    'maxweight',
    'vhf',
  ];

  const dynamicLayers = (styleJson as StyleSpecification).layers
    .filter((l) => l.type === 'symbol')
    .filter((l) => l.id.startsWith('DYNAMIC_icon_'))!;

  for (const dynamicLayer of dynamicLayers) {
    // walk thru the filter and find every `['==', ['get', 'seamark:type'], value]`,
    // keeping only the values
    const ALL_TYPES = [...walkExpression(dynamicLayer.filter)]
      .filter((exp) => Array.isArray(exp))
      .filter(
        (exp) =>
          exp[0] === '==' &&
          Array.isArray(exp[1]) &&
          exp[1][0] === 'get' &&
          exp[1][1] === 'seamark:type',
      )
      .map((exp) => exp[2])
      .filter((v) => typeof v === 'string');

    for (const type of ALL_TYPES) {
      for (const attribute of ALL_ATTRIBUTES) {
        ALL_KEYS.push(`seamark:${type}:${attribute}`);

        if (ARRAY_KEYS.has(type)) {
          for (let i = 1; i < 10; i++) {
            ALL_KEYS.push(`seamark:${type}:${i}:${attribute}`);
          }
        }
      }
    }

    // reaplce the icon-image property with a URL query string.
    // because this expression is insanely long, we generate it
    // dynamically here, instead of hardcoding it in style.json
    dynamicLayer.layout!['icon-image'] = [
      'concat',
      ...ALL_KEYS.map(
        (key): ExpressionSpecification => [
          'case',
          ['has', key],
          ['concat', `&${key}=`, ['get', key]],
          '',
        ],
      ),
    ];
  }

  return styleJson as StyleSpecification;
}
