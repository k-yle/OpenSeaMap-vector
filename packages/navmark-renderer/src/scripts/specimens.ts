import { dirname, join } from 'node:path';
import { promises as fs } from 'node:fs';
import { NOTICES, renderNoticeSvg } from '../notice-mark.js';
import { svgToString } from '../util/svgToString.js';

// generates an SVG for every file that we support. these files
// are eventually deployed with the website, so they can be accessed
// by the legend, and by the taginfo file.

const outDir = join(import.meta.dirname, '../../specimens');

for (const id in NOTICES) {
  const svg = renderNoticeSvg({ 'seamark:notice:category': id }, 2, 1)!;
  const svgString = svgToString(svg!.svg);

  const outFilePath = join(outDir, `notices/${id}.svg`);
  await fs.mkdir(dirname(outFilePath), { recursive: true });
  await fs.writeFile(outFilePath, svgString);
}
