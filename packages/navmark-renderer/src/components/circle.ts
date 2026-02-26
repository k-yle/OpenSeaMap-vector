/** mimics `<circle />`, so we use SVG paths for everything */
export function circle(cx: number, cy: number, r: number) {
  // from https://stackoverflow.com/a/10477334
  return `
    M ${cx} ${cy}
    m ${r}, 0
    a ${r},${r} 0 1,1 ${-(2 * r)},0
    a ${r},${r} 0 1,1 ${+(2 * r)},0
  `
    .replaceAll('\n', ' ')
    .replaceAll(/ +/g, ' ')
    .trim();
}
