import { useEffect, useRef } from 'react';
import { Map, Popup, addProtocol } from 'maplibre-gl';
import { PMTiles, Protocol } from 'pmtiles';
import { PMTILES_URL, getStyle } from './style.js';
import { onStyleImageMissing } from './onStyleImageMissing.js';

const protocol = new Protocol();
addProtocol('pmtiles', protocol.tile);

const pmTiles = new PMTiles(PMTILES_URL);
protocol.add(pmTiles);

export const App: React.FC = () => {
  const domRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>(null);

  useEffect(() => {
    getStyle()
      .then((style) => {
        if (mapRef.current) return; // already inited

        // setup on-click for popover
        const clickableKeys = style.layers
          .map((l) => l.id)
          .filter(
            (id) =>
              id !== 'basemap' &&
              // massive area layers can't be clicked, but you can
              // still click the border symbols
              id !== 'fairway' &&
              id !== 'restricted_area[fill]',
          );

        const map = new Map({
          container: 'map',
          zoom: 17,
          center: { lat: -36.840648, lon: 174.768936 },
          style,
          hash: 'map',
        });
        mapRef.current = map;

        map.on('styleimagemissing', onStyleImageMissing);

        map.on('mouseenter', clickableKeys, () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', clickableKeys, () => {
          map.getCanvas().style.cursor = '';
        });
        map.on('click', clickableKeys, (event) => {
          new Popup()
            .setLngLat(event.lngLat)
            .setHTML('hi <3')
            .setMaxWidth('80vw')
            .addTo(map);
        });
      })
      .catch(console.error);
  }, []);

  return <div id="map" ref={domRef} />;
};
