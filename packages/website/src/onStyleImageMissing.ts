import type { Map, MapLibreEvent } from 'maplibre-gl';

export async function onStyleImageMissing(
  this: Map,
  event: MapLibreEvent & { id: string },
) {
  try {
    const parsed = Object.fromEntries(new URLSearchParams(event.id.slice(1)));

    console.info('need to render', parsed);
  } catch (ex) {
    console.error(ex);
  }
}
