import { renderBuoyBeaconLx } from './buoy-beacon-lx.js';
import { renderNoticeMark } from './notice-mark.js';
import type { Tags } from './util/types.def.js';

export type { Tags } from './util/types.def.js';

export function render(tags: Tags, scale: number) {
  return tags['seamark:type'] === 'notice'
    ? renderNoticeMark(tags, scale / 4) // internally, this function uses a different scale
    : renderBuoyBeaconLx(tags, scale * 2);
}
