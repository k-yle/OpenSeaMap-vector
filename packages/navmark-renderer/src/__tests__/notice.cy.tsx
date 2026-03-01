import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { renderNoticeMark } from '../notice-mark.js';

//
// this file has the slow browser-tests, which are
// only required to test text-rendering, since that
// depends uses a canvas. See the other file for the
// simpler SVG tests.
//

function renderToDom(bytes: ImageData) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = bytes.width;
  canvas.height = bytes.height;
  canvas.role = 'img';
  ctx.putImageData(bytes, 0, 0);

  document.body.querySelector('canvas')?.remove();
  document.body.innerHTML = '';
  document.body.append(canvas);
}

describe(renderNoticeMark, () => {
  it('can render a simple icon', async () => {
    const bytes = (await renderNoticeMark(
      { 'seamark:notice:category': 'overhead_cable' },
      1,
    ))!;

    renderToDom(bytes);
    expect(page.getByRole('img')).toMatchScreenshot('notice-0');
  });

  it('can render text onto an icon', async () => {
    const bytes = (await renderNoticeMark(
      {
        'seamark:notice:category': 'speed_limit',
        maxspeed: '8 kt',
      },
      1,
    ))!;

    renderToDom(bytes);
    expect(page.getByRole('img')).toMatchScreenshot('notice-1');
  });

  it('can render multiple icons in a grid, some with text', async () => {
    const bytes = (await renderNoticeMark(
      {
        'seamark:notice:1:category': 'speed_limit',
        'seamark:notice:2:category': 'overhead_cable',
        'seamark:notice:3:category': 'invaliddd',
        'seamark:notice:4:category': 'make_radio_contact',
        'seamark:notice:6:category': 'limited_headroom',
        maxspeed: '20 kt',
        maxheight: '18',
        vhf: '73',
      },
      1,
    ))!;

    renderToDom(bytes);
    expect(page.getByRole('img')).toMatchScreenshot('notice-2');
  });
});
