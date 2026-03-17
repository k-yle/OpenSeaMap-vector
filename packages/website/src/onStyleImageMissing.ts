import type { Map, MapLibreEvent } from 'maplibre-gl';
import { render } from '@openseamap-vector/navmark-renderer';
import { getBurgee } from './external/wikidata.js';
import { SCALE } from './style.js';

const inflight: { [id: string]: Promise<void> } = {};

export async function onStyleImageMissing(
  this: Map,
  event: MapLibreEvent & { id: string },
) {
  inflight[event.id] ||= (async () => {
    try {
      const parsed = Object.fromEntries(new URLSearchParams(event.id.slice(1)));

      const burgeeKey = '_burgee_';

      const buffer =
        '_burgee_' in parsed
          ? await getBurgee(parsed[burgeeKey])
          : await render(parsed, SCALE);

      if (!buffer) return;

      if (this.hasImage(event.id)) return; // abort if already loaded
      this.addImage(event.id, buffer, { pixelRatio: this.getPixelRatio() });
    } catch (ex) {
      console.error(ex);
    }
    delete inflight[event.id];
  })();
}
