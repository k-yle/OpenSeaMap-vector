import { use, useEffect, useState } from 'react';
import { ActionIcon, NavLink } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import type { Map } from 'maplibre-gl';
import { AppContext } from '../context/AppContext.js';
import { LocaleContext } from '../context/LocaleContext.js';
import { getEditorUrl } from '../util/osm.js';

function getMapLocation(map: Map) {
  const { lat, lng } = map.getCenter();
  return [map.getZoom(), lat, lng].map((n) => n.toFixed(2)).join('/');
}

export const EditButton: React.FC<{
  isMobile?: boolean;
}> = ({ isMobile }) => {
  const { map } = use(AppContext);
  const { $ } = use(LocaleContext);

  const [location, setLocation] = useState(() => map && getMapLocation(map));

  useEffect(() => {
    if (!map) return undefined;

    const onMove = () => setLocation(getMapLocation(map));
    map.on('moveend', onMove);
    return () => {
      map.off('moveend', onMove);
    };
  }, [map]);

  if (!location) return null;

  const href = getEditorUrl({ map: location });

  return isMobile ? (
    <NavLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      label={$('Navbar.edit')}
      bdrs={8}
      my={4}
      leftSection={<IconPencil />}
    />
  ) : (
    <ActionIcon
      variant="subtle"
      color="gray"
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={$('Navbar.edit')}
    >
      <IconPencil />
    </ActionIcon>
  );
};
