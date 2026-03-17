import { useEffect, useRef, useState } from 'react';
import { type Tags, render } from '@openseamap-vector/navmark-renderer';

function stringToTags(str: string): Tags | undefined {
  try {
    return Object.fromEntries(
      str
        .split('\n')
        .map((kv) => {
          if (!kv) return [];
          const [k, ...v] = kv.split('=');
          return [k!.trim(), v.join('=').trim()];
        })
        .filter(([k, v]) => k && v),
    );
  } catch {
    return undefined;
  }
}

const tagsToString = (tags: Tags): string =>
  Object.entries(tags)
    .map((v) => v.join('='))
    .join('\n');

const SCALE_PROP = '__scale';
const DEFAULT_TAGS: Tags[] = [
  {
    [SCALE_PROP]: '6',
    'seamark:type': 'notice',
    'seamark:notice:1:category': 'speed_limit',
    'seamark:notice:2:category': 'overhead_cable',
    'seamark:notice:3:category': 'invaliddd',
    'seamark:notice:4:category': 'make_radio_contact',
    'seamark:notice:6:category': 'limited_headroom',
    maxspeed: '20 kt',
    maxheight: '18',
    vhf: '73',
  },
  {
    [SCALE_PROP]: '6',
    'seamark:type': 'beacon_special_purpose',
    'seamark:beacon_special_purpose:shape': 'pile',
    'seamark:beacon_special_purpose:colour': 'yellow;violet',
    'seamark:beacon_special_purpose:colour_pattern': 'vertical',
    'seamark:topmark:shape': '2 cones base together',
    'seamark:topmark:colour': 'red;blue',
    'seamark:light:colour': 'green',
    'seamark:fog_signal:category': 'horn',
  },
  {
    [SCALE_PROP]: '6',
    'seamark:type': 'buoy_cardinal',
    'seamark:buoy_cardinal:category': 'west',
    'seamark:buoy_cardinal:colour': 'yellow;black;yellow',
    'seamark:buoy_cardinal:colour_pattern': 'horizontal',
    'seamark:light:colour': 'white',
    'seamark:topmark:colour': 'black',
    'seamark:topmark:shape': '2 cones point together',
  },
];

/**
 * Not part of the main app, this is a small debug page to
 * test canvas rendering
 */
export const NavmarkPreview: React.FC = () => {
  const [tagsString, setTagsString] = useState(
    () =>
      new URLSearchParams(window.location.search).get('tags') ||
      tagsToString(DEFAULT_TAGS[0]!),
  );
  const tags = stringToTags(tagsString);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // sync tags with URL qs
    const qs = new URLSearchParams({
      page: 'navmark-preview',
      tags: tagsString,
    });
    const url = `${window.location.origin + window.location.pathname}?${qs}`;
    window.history.replaceState('', '', url);
  }, [tagsString]);

  useEffect(() => {
    if (!tags) return;
    const canvas = canvasRef.current!;
    canvas.width = 0.5 * window.innerWidth; // 50vw
    canvas.height = window.innerHeight; // 100vh
    const scale = +(tags[SCALE_PROP] || 0) || 6;

    const { width, height } = canvas;
    const ctx = canvas!.getContext('2d')!;

    render(tags, scale)
      .finally(() => ctx.clearRect(0, 0, width, height))
      .then((imageData) => imageData && ctx.putImageData(imageData, 0, 0));
  }, [tags]);

  return (
    <>
      <div style={{ display: 'flex' }}>
        <textarea
          placeholder="Tags"
          value={tagsString}
          onChange={(event) => setTagsString(event.target.value)}
          onBlur={(event) => {
            const newParsed = stringToTags(event.target.value);
            if (newParsed) setTagsString(tagsToString(newParsed));
          }}
          style={{
            width: '50vw',
            height: '100vh',
            color: tags ? 'black' : 'red',
          }}
        />
        <canvas ref={canvasRef} style={{ width: '50vw', height: '100vh' }} />
      </div>
      <button
        onClick={() => {
          setTagsString(
            tagsToString(
              DEFAULT_TAGS[(Math.random() * DEFAULT_TAGS.length) | 0]!,
            ),
          );
        }}
        style={{ position: 'fixed', bottom: 10, left: 10 }}
      >
        Random Example
      </button>
    </>
  );
};
