export function svgToString(svg: React.ReactNode) {
  const string = `<?xml version="1.0" encoding="UTF-8"?>${svg}`;

  // crude hack to format each tag on a new line. works well
  // enough for now, and we have 100% test coverage, so it
  // should be safe 👀
  return string.replaceAll('><', '>\n<');
}
