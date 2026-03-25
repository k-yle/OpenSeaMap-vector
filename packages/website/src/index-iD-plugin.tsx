//
// this file is the entrypoint when used as an iD plugin.
//
import { useEffect, useRef, useSyncExternalStore } from 'react';
import type * as iD from '@openstreetmap/id-plugin-sdk';
import { type Root, createRoot } from 'react-dom/client';
import { render } from '@openseamap-vector/navmark-renderer';
import type { Tags } from 'osm-api';
import { SCALE } from './style.js';

function isAllTagsHaveSameValue(tags: iD.MultiTags): tags is iD.Tags {
  return Object.values(tags).every((value) => !Array.isArray(value));
}

const Plugin: React.FC<{ domRoot: HTMLElement } & iD.PluginData> = ({
  tagsStore,
  domRoot,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tags = useSyncExternalStore(tagsStore.subscribe, tagsStore.getValue);

  useEffect(() => {
    if (!tags) return;
    const canvas = canvasRef.current!;
    canvas.width = domRoot.offsetWidth;
    canvas.height = domRoot.offsetHeight;

    const { width, height } = canvas;
    const ctx = canvas!.getContext('2d')!;

    const flatTags: Tags = {};
    for (const [k, v] of Object.entries(tags)) {
      flatTags[k] = Array.isArray(v) ? v[0]! : v;
    }

    render(flatTags, SCALE)
      .finally(() => ctx.clearRect(0, 0, width, height))
      .then((imageData) => imageData && ctx.putImageData(imageData, 0, 0));
  }, [tags, domRoot]);

  if (!isAllTagsHaveSameValue(tags)) {
    return <>multiselection is not supported.</>;
  }

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default class WebComponent
  extends HTMLElement
  implements iD.WebComponentPlugin
{
  readonly #domRoot: HTMLBodyElement;

  readonly #reactRoot: Root;

  #data?: iD.PluginData;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.#domRoot = document.createElement('body');
    this.shadowRoot!.append(this.#domRoot);

    this.#reactRoot = createRoot(this.#domRoot);
  }

  init(data: iD.PluginData) {
    this.#data = data;
    this.#reactRoot.render(<Plugin domRoot={this.#domRoot} {...this.#data} />);
  }

  disconnectedCallback() {
    this.#reactRoot.unmount();
  }
}
