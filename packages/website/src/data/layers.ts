/** ⚠️ the keys MUST match Layers.java */
export enum Layer {
  navmarks = 1 << 0, // and extrapolated navlines+rectracks
  hazards = 1 << 1, // and barriers
  notices = 1 << 2,
  areas = 1 << 3, // and TSS
  recreational = 1 << 4, // and paddling and sport
  general = 1 << 5,
  businesses = 1 << 6,
  // there is another layer called 'unknown', but we don't show that to users
}

export type LayerName = keyof typeof Layer;

export const LAYER_LABELS: Record<Layer, string> = {
  [Layer.navmarks]: 'Navigational Marks',
  [Layer.hazards]: 'Hazards',
  [Layer.notices]: 'Signs / Notices',
  [Layer.areas]: 'Areas',
  [Layer.recreational]: 'Recreational Facilities',
  [Layer.general]: 'General',
  [Layer.businesses]: 'Organisations',
};
