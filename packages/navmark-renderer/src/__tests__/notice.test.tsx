import { describe, expect, it } from 'vitest';
import { NOTICES, renderNoticeMark, renderNoticeSvg } from '../notice-mark.js';
import { svgToString } from '../util/svgToString.js';
import type { Tags } from '../util/types.def.js';

//
// this file has the fast SVG tests, but therefore
// it doesn't support rendering text onto the symbols,
// since that's done with the canvas, and tested in the
// other e2e file.
//

describe(renderNoticeMark, () => {
  it('can render a single icon', () => {
    const svg = renderNoticeSvg(
      { 'seamark:notice:category': 'overhead_cable' },
      1,
      1,
    )!;

    expect(svgToString(svg!.svg)).toMatchFileSnapshot('notice-single.svg');
  });

  it('can render a grid of every possible icons', () => {
    const tags: Tags = {};
    let i = 0;
    for (const id in NOTICES) {
      tags[`seamark:notice:${++i}:category`] = id;
    }
    const svg = renderNoticeSvg(tags, 1, 12)!;

    expect(svgToString(svg!.svg)).toMatchFileSnapshot('notice-all.svg');
  });
});
