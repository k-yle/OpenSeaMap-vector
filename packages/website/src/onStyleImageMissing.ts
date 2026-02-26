import type { Map, MapLibreEvent } from 'maplibre-gl';
import {
  renderBuoyBeaconLx,
  renderNoticeMark,
} from '@openseamap-vector/navmark-renderer';

export async function onStyleImageMissing(
  this: Map,
  event: MapLibreEvent & { id: string },
) {
  try {
    const parsed = Object.fromEntries(new URLSearchParams(event.id.slice(1)));

    const buffer =
      parsed['seamark:type'] === 'notice'
        ? await renderNoticeMark(parsed)
        : await renderBuoyBeaconLx(parsed);

    if (!buffer) return;

    if (this.hasImage(event.id)) return; // abort if already loaded
    this.addImage(event.id, buffer, { pixelRatio: this.getPixelRatio() });
  } catch (ex) {
    console.error(ex);
  }
}
