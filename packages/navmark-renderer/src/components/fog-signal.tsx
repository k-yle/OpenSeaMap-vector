import type { CompositeSvg } from '../util/types.def.js';

export function createFogSignal(): CompositeSvg {
  const svg = (
    <path
      stroke="#a30075"
      d="M-2.6981 18.2153A12.0081 12.008 90 01-6.8233 11.0982M-.8707 16.0422A9.167 9.167 90 01-4.0245 10.6113M1.0203 13.8215A6.249 6.2489 90 01-1.1512 10.106"
    />
  );
  return { svg };
}
