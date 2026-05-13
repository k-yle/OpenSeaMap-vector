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
  it('can render a single icon', async () => {
    const svg = renderNoticeSvg(
      { 'seamark:notice:category': 'overhead_cable' },
      2,
      1,
    )!;

    await expect(svgToString(svg!.svg)).toMatchFileSnapshot(
      'notice-single.svg',
    );
  });

  it('can render a single icon with a left-arrow', async () => {
    const svg = renderNoticeSvg(
      {
        'seamark:notice:category': 'no_motor_craft',
        'seamark:notice:addition': 'left_triangle',
      },
      2,
      1,
    )!;

    await expect(svgToString(svg!.svg)).toMatchFileSnapshot(
      'notice-single-arrow-left.svg',
    );
  });

  it('can render a single icon with a right-arrow', async () => {
    const svg = renderNoticeSvg(
      {
        'seamark:notice:category': 'no_motor_craft',
        'seamark:notice:addition': 'right_triangle',
      },
      2,
      1,
    )!;

    await expect(svgToString(svg!.svg)).toMatchFileSnapshot(
      'notice-single-arrow-right.svg',
    );
  });

  it('can render a single icon with an arrow in both directions', async () => {
    const svg = renderNoticeSvg(
      {
        'seamark:notice:category': 'no_motor_craft',
        'seamark:notice:addition': 'right_triangle;left_triangle',
      },
      2,
      1,
    )!;

    await expect(svgToString(svg!.svg)).toMatchFileSnapshot(
      'notice-single-arrow-both.svg',
    );
  });

  it('can render multiple icon with arrows in various directions', async () => {
    const svg = renderNoticeSvg(
      {
        'seamark:notice:1:category': 'speed_limit',
        'seamark:notice:1:addition': 'right_triangle',
        'seamark:notice:2:category': 'speed_limit',
        'seamark:notice:2:addition': 'left_triangle',
        'seamark:notice:3:category': 'speed_limit',
      },
      2,
      2,
    )!;

    await expect(svgToString(svg!.svg)).toMatchFileSnapshot(
      'notice-multiple-arrows.svg',
    );
  });

  it('can render multiple icon with arrows in various directions and gaps', async () => {
    const svg = renderNoticeSvg(
      {
        'seamark:notice:1:category': 'speed_limit',
        'seamark:notice:1:addition': 'right_triangle',
        'seamark:notice:2:category': 'speed_limit',
        'seamark:notice:2:addition': 'left_triangle',
        'seamark:notice:3:category': 'speed_limit',
        'seamark:notice:3:addition': 'right_triangle',
      },
      2,
      2,
    )!;

    await expect(svgToString(svg!.svg)).toMatchFileSnapshot(
      'notice-multiple-arrows-gaps.svg',
    );
  });

  it('handles a mix of :n: and semicolon-delimeted values', async () => {
    const svg = renderNoticeSvg(
      {
        // this is obviously bad tagging, but we can still support it
        'seamark:notice:category': 'limited_depth',
        'seamark:notice:1:category': 'overhead_cable;limited_headroom;',
        'seamark:notice:2:category': ';no_high_speeds',
      },
      2,
      2,
    )!;

    await expect(svgToString(svg!.svg)).toMatchFileSnapshot(
      'notice-semicolon.svg',
    );
  });

  it('can render a grid of every possible icons', async () => {
    const tags: Tags = {};
    let i = 0;
    for (const id in NOTICES) {
      tags[`seamark:notice:${++i}:category`] = id;
    }
    const svg = renderNoticeSvg(tags, 2, 12)!;

    await expect(svgToString(svg!.svg)).toMatchFileSnapshot('notice-all.svg');
  });
});
