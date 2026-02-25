import type { OsmFeatureType } from 'osm-api';

export interface OsmId {
  type: OsmFeatureType;
  id: bigint;
}

export function bigintToOsmId(bigint: bigint | string | number): OsmId {
  const type = <OsmFeatureType>(
    ['', 'node', 'way', 'relation'][Number(BigInt(bigint) >> 44n)]
  );
  const id = BigInt(bigint) & ((1n << 44n) - 1n);

  return { type, id };
}

export function osmIdToUrl(osmId: OsmId) {
  return `https://osm.org/${osmId.type}/${osmId.id}`;
}

export function osmIdtoEditorUrl(osmId: OsmId) {
  const qs = new URLSearchParams({
    overlays: 'openseamap',
    background: 'MAPNIK',
    id: osmId.type[0]! + osmId.id,
  });
  return `https://kyle.kiwi/iD/#${qs}`;
}
