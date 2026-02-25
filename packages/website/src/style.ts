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

export async function getStyle() {
  const styleJson: typeof styleJsonType = await fetch(styleJsonUrl).then((r) =>
    r.json(),
  );

  styleJson.sources.seamarks.url = `pmtiles://${PMTILES_URL}`;
  styleJson.sprite[0]!.url = `${SELF_BASE_URL}/icons`;

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

  const ALL_KEYS = ['seamark:type', 'seamark:name'];

  const dynamicLayer = (styleJson as StyleSpecification).layers
    .filter((l) => l.type === 'symbol')
    .find((l) => l.id === 'DYNAMIC')!;

  const ALL_TYPES = (
    dynamicLayer.filter as ['==', key: string, value: string][]
  )
    .slice(1)
    .map((x) => x[2]);

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

  return styleJson as StyleSpecification;
}
