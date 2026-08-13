import { useEffect, useState } from 'react';
import { Button, Checkbox, Menu } from '@mantine/core';
import { IconStack2 } from '@tabler/icons-react';
import type { Map } from 'maplibre-gl';
import { LAYER_LABELS, LAYER_NAME_TO_ID, type Layer } from '../data/layers.js';

// the disabled layers are stored using a bitmask in the URL
const PROP = 'l';

const getQs = () => new URLSearchParams(window.location.hash.slice(1));

export const LayerSwitcher: React.FC<{ map: Map }> = ({ map }) => {
  const [hiddenLayers, setHiddenLayers] = useState(
    () => +(getQs().get(PROP) || 0),
  );

  useEffect(() => {
    // sync state with URL qs
    const qs = getQs();
    if (hiddenLayers) {
      qs.set(PROP, hiddenLayers.toString());
    } else {
      qs.delete(PROP); // don't include ?hide=0
    }
    const url = new URL(window.location.href);
    url.hash = qs.toString().replaceAll('%2F', '/'); // undo URLSearchParams's annoying behaviour
    window.history.replaceState('', '', url);
  }, [hiddenLayers]);

  useEffect(() => {
    // sync state with the map
    for (const styleLayer of map.getStyle().layers) {
      if (!('source-layer' in styleLayer)) continue;
      if (!styleLayer['source-layer']) continue;

      const layerId = LAYER_NAME_TO_ID[styleLayer['source-layer']];
      if (!layerId) throw new Error(`unknown layer “${layerId}”`);

      map.setLayoutProperty(
        styleLayer.id,
        'visibility',
        hiddenLayers & layerId ? 'none' : 'visible',
      );
    }
  }, [hiddenLayers, map]);

  const toggle = (value: Layer) =>
    setHiddenLayers((current) => current ^ value);

  return (
    <Menu closeOnItemClick={false} position="bottom-end" shadow="md">
      <Menu.Target>
        <Button variant="subtle" color="gray" leftSection={<IconStack2 />}>
          Layers
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {Object.keys(LAYER_LABELS).map((_layer) => {
          const layer = +_layer as Layer;

          return (
            <Menu.Item key={layer} onClick={() => toggle(layer)}>
              <Checkbox
                label={LAYER_LABELS[layer]}
                checked={!(hiddenLayers & layer)}
                onChange={() => toggle(layer)}
                style={{ pointerEvents: 'none' }}
              />
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};
