import { Fragment, use, useState } from 'react';
import { Button, Loader, Menu } from '@mantine/core';
import { IconBackground, IconCheck } from '@tabler/icons-react';
import {
  type BasemapGroup,
  DEFAULT_BASEMAP,
  changeBasemap,
  getAvailableLayers,
} from '../external/eli.js';
import { AppContext } from '../context/AppContext.js';
import { LocaleContext } from '../context/LocaleContext.js';

export const BasemapSwitcher: React.FC<{
  isMobile?: boolean;
}> = ({ isMobile }) => {
  const { $ } = use(LocaleContext);
  const { map } = use(AppContext);
  const [groups, setGroups] = useState<BasemapGroup[]>();
  const [error, setError] = useState<unknown>();
  const [currentBasemap, setCurrentBasemap] = useState(DEFAULT_BASEMAP);

  if (!map) return null;

  return (
    <Menu
      position="bottom-start"
      shadow="md"
      onOpen={() => {
        setError(undefined);
        setGroups(undefined);
        getAvailableLayers(map, $).then(setGroups).catch(setError);
      }}
    >
      <Menu.Target>
        <Button
          variant="subtle"
          color="gray"
          leftSection={<IconBackground />}
          fullWidth={isMobile}
          justify={isMobile ? 'flex-start' : undefined}
          bdrs={isMobile ? 8 : undefined}
          my={isMobile ? 4 : undefined}
          styles={{ section: { marginInlineEnd: 'var(--mantine-spacing-sm)' } }}
        >
          {$('Navbar.basemap')}
        </Button>
      </Menu.Target>
      <Menu.Dropdown mah="min(60vh, 500px)" style={{ overflowY: 'auto' }}>
        {!!error && <Menu.Item disabled>{$('generic.error')}</Menu.Item>}
        {!groups && (
          <Menu.Item disabled>
            <Loader />
          </Menu.Item>
        )}
        {groups?.map((group) => (
          <Fragment key={group.id}>
            <Menu.Label>{group.label}</Menu.Label>
            {group.sources.map((layer) => (
              <Menu.Item
                key={layer.id}
                title={layer.description}
                leftSection={
                  <IconCheck
                    size={16}
                    opacity={layer.id === currentBasemap ? 1 : 0}
                  />
                }
                onClick={() => {
                  setCurrentBasemap(layer.id);
                  changeBasemap(map, layer);
                }}
              >
                {layer.name}
              </Menu.Item>
            ))}
          </Fragment>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
