export enum Layer {
  NavMark = 1 << 0, // and extrapolated navlines+rectracks
  Hazards = 1 << 1, // and barriers
  Notices = 1 << 2,
  Areas = 1 << 3, // and TSS
  Recreational = 1 << 4, // and paddling and sport
  General = 1 << 5,
  Businesses = 1 << 6,
}

/** ⚠️ the value MUST match Layers.java */
export const LAYER_NAME_TO_ID: Record<string, Layer> = {
  navmarks: Layer.NavMark,
  hazards: Layer.Hazards,
  notices: Layer.Notices,
  areas: Layer.Areas,
  recreational: Layer.Recreational,
  general: Layer.General,
  businesses: Layer.Businesses,
  // there is another layer called 'unknown', but we don't show that to users
};

export const LAYER_LABELS: Record<Layer, string> = {
  [Layer.NavMark]: 'Navigational Marks',
  [Layer.Hazards]: 'Hazards',
  [Layer.Notices]: 'Signs / Notices',
  [Layer.Areas]: 'Areas',
  [Layer.Recreational]: 'Recreational Facilities',
  [Layer.General]: 'General',
  [Layer.Businesses]: 'Organisations',
};
