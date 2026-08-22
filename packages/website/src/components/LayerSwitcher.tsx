import { use } from 'react';
import { Button, Checkbox, Menu } from '@mantine/core';
import { IconStack2 } from '@tabler/icons-react';
import { LAYER_LABELS, type Layer } from '../data/layers.js';
import { LayerContext } from '../context/LayerContext.js';

const LAYERS = Object.keys(LAYER_LABELS).map((layer) => +layer as Layer);

export const LayerSwitcher: React.FC<{
  isMobile?: boolean;
}> = ({ isMobile }) => {
  const { hiddenLayers, toggle } = use(LayerContext);
  return (
    <Menu closeOnItemClick={false} position="bottom-start" shadow="md">
      <Menu.Target>
        <Button
          variant="subtle"
          color="gray"
          leftSection={<IconStack2 />}
          fullWidth={isMobile}
          justify={isMobile ? 'flex-start' : undefined}
          bdrs={isMobile ? 8 : undefined}
          my={isMobile ? 4 : undefined}
          styles={{ section: { marginInlineEnd: 'var(--mantine-spacing-sm)' } }}
        >
          Layers
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {LAYERS.map((layer) => {
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
