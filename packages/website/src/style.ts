import type { StyleSpecification } from 'maplibre-gl';
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

  return styleJson as StyleSpecification;
}
