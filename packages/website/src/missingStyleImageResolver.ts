import type { Map } from 'maplibre-gl';
import { render } from 'navmark-renderer';
import { getBurgee } from './external/wikidata.js';
import { SCALE } from './style.js';

const inflight: { [id: string]: Promise<void> } = {};

export async function missingStyleImageResolver(map: Map, id: string) {
  let isUnimportant = false;

  const parsed = Object.fromEntries(new URLSearchParams(id.slice(1)));

  const burgeeKey = '_burgee_';
  if (burgeeKey in parsed) isUnimportant = true;

  inflight[id] ||= (async () => {
    try {
      const buffer =
        '_burgee_' in parsed
          ? await getBurgee(parsed[burgeeKey])
          : await render(parsed, SCALE);

      if (!buffer) return;

      if (map.hasImage(id)) return; // abort if already loaded
      map.addImage(id, buffer, { pixelRatio: map.getPixelRatio() });
      delete inflight[id];
    } catch (ex) {
      console.error(ex);
    }
  })();

  // do not block rendering for irrelevant things like burgee
  if (isUnimportant) return undefined;

  // for important things, await the promise
  return inflight[id];
}
