import { dirname, join } from 'node:path';
import { promises as fs } from 'node:fs';
import { NOTICES, renderNoticeSvg } from '../notice-mark.js';
import { svgToString } from '../util/svgToString.js';
import type { Tags } from '../util/types.def.js';

// generates an SVG for every file that we support. these files
// are eventually deployed with the website, so they can be accessed
// by the legend, and by the taginfo file.

const outDir = join(import.meta.dirname, '../../specimens');

async function render(fileName: string, tags: Tags) {
  const svg = renderNoticeSvg(tags, 2, 1)!;
  const svgString = svgToString(svg!.svg);

  const outFilePath = join(outDir, `notices/${fileName}.svg`);
  await fs.mkdir(dirname(outFilePath), { recursive: true });
  await fs.writeFile(outFilePath, svgString);
}

for (const [id, notice] of Object.entries(NOTICES)) {
  await render(id, { 'seamark:notice:category': id });
  // if the icon has variants, render a specimen for each variant
  if ('samples' in notice) {
    for (const [label, sampleTags] of Object.entries(notice.samples)) {
      await render(`${id}__${label}`, {
        'seamark:notice:category': id,
        ...sampleTags,
      });
    }
  }
}
