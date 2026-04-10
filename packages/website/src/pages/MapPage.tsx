import { useEffect, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  GeolocateControl,
  Map,
  Popup,
  ScaleControl,
  type Unit,
  addProtocol,
} from 'maplibre-gl';
import * as Diplomat from '@americana/diplomat';
import { PMTiles, Protocol } from 'pmtiles';
import { PMTILES_URL, SCALE, getStyle } from '../style.js';
import { onStyleImageMissing } from '../onStyleImageMissing.js';
import { MapPopup } from '../components/MapPopup.js';
import { HOME_LOCATION } from '../util/region.js';

const protocol = new Protocol();
addProtocol('pmtiles', protocol.tile);

const pmTiles = new PMTiles(PMTILES_URL);
protocol.add(pmTiles);

/* eslint-disable @eslint-react/web-api/no-leaked-event-listener -- this is the root component, it never gets unmounted */

export const MapPage: React.FC = () => {
  const domRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>(null);

  useEffect(() => {
    const [zoom, lon, lat] = HOME_LOCATION;
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
          zoom,
          center: { lat, lon },
          style,
          hash: 'map',
          pixelRatio: SCALE,
        });
        mapRef.current = map;

        map.addControl(
          new GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          }),
        );

        // clicking the toggle cycles thru all 3 units
        const scaleOptions: Unit[] = ['nautical', 'metric', 'imperial'];
        let scaleIndex = 0;
        const scale = new ScaleControl({
          maxWidth: 80,
          unit: scaleOptions[scaleIndex],
        });
        map.addControl(scale);
        scale._container.style.cursor = 'pointer';
        scale._container.addEventListener('click', () => {
          scale.setUnit(scaleOptions[++scaleIndex % scaleOptions.length]!);
        });

        function localise() {
          Diplomat.localizeStyle(map, undefined, { glossLocalNames: true });
        }

        window.addEventListener('hashchange', (event) => {
          const oldLanguage = Diplomat.getLanguageFromURL(
            new URL(event.oldURL),
          );
          const newLanguage = Diplomat.getLanguageFromURL(
            new URL(event.newURL),
          );

          if (oldLanguage !== newLanguage) localise();
        });

        window.addEventListener('languagechange', localise);

        map.once('styledata', localise);

        map.on('styleimagemissing', onStyleImageMissing);

        map.on('mouseenter', clickableKeys, () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', clickableKeys, () => {
          map.getCanvas().style.cursor = '';
        });
        map.on('click', clickableKeys, (event) => {
          const feature = event.features![0]!;

          new Popup()
            .setLngLat(event.lngLat)
            .setHTML(renderToStaticMarkup(<MapPopup feature={feature} />))
            .setMaxWidth('80vw')
            .addTo(map);
        });
      })
      .catch(console.error);
  }, []);

  return <div id="map" ref={domRef} />;
};
