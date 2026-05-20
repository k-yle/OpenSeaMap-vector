import type { IControl, Map } from 'maplibre-gl';
import type { FeatureCollection, Geometry } from 'geojson';
import whichPolygon from 'which-polygon';
import layerIcon from '../static/layers.svg?url';

/** based on https://github.com/k-yle/tileserver-export/blob/main/src/types/eli.d.ts */
export type ELI = {
  /**
   * The name of the imagery source
   */
  name: string;
  /**
   * Whether the imagery name should be translated
   */
  i18n?: boolean;
  type: 'tms' | 'wms' | 'bing' | 'scanex' | 'wms_endpoint' | 'wmts';
  /**
   * A rough categorisation of different types of layers
   */
  category?:
    | 'photo'
    | 'map'
    | 'historicmap'
    | 'osmbasedmap'
    | 'historicphoto'
    | 'qa'
    | 'elevation'
    | 'other';
  /**
   * A URL template for imagery tiles
   */
  url: string;
  min_zoom?: number;
  max_zoom?: number;
  /**
   * explicit/implicit permission by the owner for use in OSM
   */
  permission_osm?: 'explicit' | 'implicit' | 'no';
  /**
   * A URL for the license or permissions for the imagery
   */
  license_url?: string;
  /**
   * A URL for the privacy policy of the operator
   */
  privacy_policy_url?: string;
  /**
   * A unique identifier for the source; used in imagery_used changeset tag
   */
  id: string;
  /**
   * A short English-language description of the source
   */
  description?: string;
  /**
   * The ISO 3166-1 alpha-2 two letter country code in upper case. Use ZZ for unknown or multiple.
   */
  country_code?: string;
  /**
   * Whether this imagery should be shown in the default world-wide menu
   */
  default?: boolean;
  /**
   * Whether this imagery is the best source for the region
   */
  best?: boolean;
  /**
   * The age of the oldest imagery or data in the source, as an RFC3339 date or leading portion of one
   */
  start_date?: string;
  /**
   * The age of the newest imagery or data in the source, as an RFC3339 date or leading portion of one
   */
  end_date?: string;
  /**
   * HTTP header to check for information if the tile is invalid
   */
  no_tile_header?: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^.*$".
     */
    [k: string]: string[] | null;
  };
  /**
   * 'true' if tiles are transparent and can be overlaid on another source
   */
  overlay?: boolean;
  available_projections?: string[];
  attribution?: {
    url?: string;
    text?: string;
    html?: string;
    required?: boolean;
  };
  /**
   * A URL for an image, that can be displayed in the list of imagery layers next to the name
   */
  icon?: string;
  /**
   * A link to an EULA text that has to be accepted by the user, before the imagery source is added. Can contain {lang} to be replaced by a current user language wiki code (like FR:) or an empty string for the default English text.
   */
  eula?: string;
  /**
   * A URL for an image, that is displayed in the mapview for attribution
   */
  'logo-image'?: string;
  /**
   * Customized text for the terms of use link (default is "Background Terms of Use")
   */
  'terms-of-use-text'?: string;
  /**
   * Specify a checksum for tiles, which aren't real tiles. `type` is the digest type and can be MD5, SHA-1, SHA-256, SHA-384 and SHA-512, value is the hex encoded checksum in lower case. To create a checksum save the tile as file and upload it to e.g. https://defuse.ca/checksums.htm.
   */
  'no-tile-checksum'?: string;
  /**
   * header-name attribute specifies a header returned by tile server, that will be shown as `metadata-key` attribute in Show Tile Info dialog
   */
  'metadata-header'?: string;
  /**
   * Set to `true` if imagery source is properly aligned and does not need imagery offset adjustments. This is used for OSM based sources too.
   */
  'valid-georeference'?: boolean;
  /**
   * Size of individual tiles delivered by a TMS service
   */
  'tile-size'?: number;
  /**
   * Whether tiles status can be accessed by appending /status to the tile URL and can be submitted for re-rendering by appending /dirty.
   */
  'mod-tile-features'?: string;
  /**
   * HTTP headers to be sent to server. It has two attributes header-name and header-value. May be specified multiple times.
   */
  'custom-http-headers'?: {
    'header-name'?: string;
    'header-value'?: string;
  };
  /**
   * Default layer to open (when using WMS_ENDPOINT type). Contains list of layer tag with two attributes - name and style, e.g. `"default-layers": ["layer": { name="Basisdata_NP_Basiskart_JanMayen_WMTS_25829" "style":"default" } ]` (not allowed in `mirror` attribute)
   */
  'default-layers'?: {
    layer?: {
      'layer-name'?: string;
      'layer-style'?: string;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  }[];
  /**
   * format to use when connecting tile server (when using WMS_ENDPOINT type)
   */
  format?: string;
  /**
   * If `true` transparent tiles will be requested from WMS server
   */
  transparent?: boolean;
  /**
   * minimum expiry time for tiles in seconds. The larger the value, the longer entry in cache will be considered valid
   */
  'minimum-tile-expire'?: number;
};

export type ELIGeoJson = FeatureCollection<Geometry, ELI>;

/** based on https://github.com/andrewharvey/osm-editor-layer-index-qgis/blob/63366ac/index.js#L64-L68 */
export function convertTileUrl(url: string) {
  return url.replace('{zoom}', '{z}').replace(/{switch:([^,}]+)[^}]*}/, '$1');
}

const isValid = (layer: ELI) =>
  (layer.type === 'tms' ||
    (layer.type === 'wms' &&
      layer.available_projections?.includes('EPSG:3857'))) &&
  !layer.name.includes(' Style)') &&
  !layer.url.includes('{apikey}');

export class EliControl implements IControl {
  #container?: HTMLDivElement;

  #map?: Map;

  #eliPromise = fetch(
    'https://osmlab.github.io/editor-layer-index/imagery.geojson',
  ).then((r) => r.json()) as Promise<ELIGeoJson>;

  currentLayerId = 'MAPNIK';

  async getAvailableLayers(): Promise<ELI[]> {
    if (!this.#map) return [];
    const geojson = await this.#eliPromise;

    const world = geojson.features
      .filter((x) => !x.geometry)
      .map((x) => x.properties)
      .filter(isValid);

    const nonWorld: ELIGeoJson = {
      features: geojson.features.filter((x) => x.geometry),
      type: 'FeatureCollection',
    };

    const query = whichPolygon<ELI>(nonWorld);

    const local = query(this.#map.getCenter().toArray(), true) || [];
    return [
      ...local.filter(isValid).toSorted((a, b) => +!a.best - +!b.best),
      ...world,
    ];
  }

  async #populateSelectOptions() {
    const layers = await this.getAvailableLayers();
    const select = this.#container?.querySelector('select');
    if (!select) return;

    select.textContent = '';
    for (const layer of layers) {
      const option = document.createElement('option');
      option.value = layer.id;
      option.textContent =
        (layer.best || layer.id === 'MAPNIK' || layer.id === 'EsriWorldImagery'
          ? '⭐ '
          : '') + layer.name;
      option.selected = this.currentLayerId === layer.id;
      select.append(option);
    }
  }

  onAdd(map: Map) {
    this.#map = map;
    this.#container = document.createElement('div');
    this.#container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
    this.#container.style.position = 'relative';

    const select = document.createElement('select');
    select.style.visibility = 'hidden';
    select.style.width = '0px';
    select.style.height = '0px';
    select.style.position = 'absolute';

    select.addEventListener('change', async () => {
      const id = select.value;
      const eli = await this.#eliPromise;
      const layer = eli.features.find(
        (l) => l.properties.id === id,
      )?.properties;
      if (!layer) throw new Error('impossible');

      this.currentLayerId = layer.id;

      const style = map.getStyle();
      // eslint-disable-next-line dot-notation
      style.sources['basemap'] = {
        type: 'raster',
        tiles: [convertTileUrl(layer.url)],
        tileSize: layer['tile-size'] || 256,
        attribution: [
          layer.attribution &&
            layer.id !== 'MAPNIK' &&
            layer.attribution.text?.link(layer.attribution.url!),
          'OpenStreetMap contributors'.link('https://osm.org/copyright'),
        ]
          .filter(Boolean)
          .join(' &middot; '),
        maxzoom: layer.max_zoom,
        minzoom: layer.min_zoom,
      };

      map.setStyle(style);
    });
    this.#container.append(select);

    const button = document.createElement('button');
    button.className = 'maplibregl-ctrl-geolocate';
    button.title = 'Layers';
    button.style.padding = '5px';
    button.style.backgroundImage = `url("${layerIcon}")`;
    button.style.backgroundSize = 'contain';
    button.style.backgroundOrigin = 'content-box';
    button.style.backgroundRepeat = 'no-repeat';
    button.addEventListener('click', async () => {
      await this.#populateSelectOptions();
      select.showPicker();
    });

    this.#container.append(button);
    return this.#container;
  }

  onRemove() {
    this.#container?.remove();
    this.#map = undefined;
  }
}
