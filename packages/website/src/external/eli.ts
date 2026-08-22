import type { Map } from 'maplibre-gl';
import type { FeatureCollection, Geometry } from 'geojson';
import whichPolygon from 'which-polygon';
import type { I$ } from '../context/LocaleContext.js';

export type EliCategory =
  | 'photo'
  | 'map'
  | 'historicmap'
  | 'osmbasedmap'
  | 'historicphoto'
  | 'qa'
  | 'elevation'
  | 'other';

/** based on https://github.com/k-yle/tileserver-export/blob/main/src/types/eli.d.ts */
export interface ELI {
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
  category?: EliCategory;
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
}

export type ELIGeoJson = FeatureCollection<Geometry, ELI>;

/** based on https://github.com/andrewharvey/osm-editor-layer-index-qgis/blob/63366ac/index.js#L64-L68 */
export function convertTileUrl(url: string) {
  return url.replace('{zoom}', '{z}').replace(/{switch:([^,}]+)[^}]*}/, '$1');
}

export const DEFAULT_BASEMAP = 'MAPNIK';

const isValid = (layer: ELI) =>
  (layer.type === 'tms' ||
    (layer.type === 'wms' &&
      layer.available_projections?.includes('EPSG:3857'))) &&
  !layer.overlay &&
  !layer.name.includes(' Style)') &&
  !layer.url.includes('{apikey}');

const isRecommended = (layer: ELI) =>
  !!layer.best ||
  layer.id === DEFAULT_BASEMAP ||
  layer.id === 'EsriWorldImagery';

let eliPromise: Promise<ELIGeoJson> | undefined;

const CATEGORY_LABELS: Record<EliCategory, (($: I$) => string) | undefined> = {
  photo: ($) => $('eli.photo'),
  map: ($) => $('eli.map'),
  osmbasedmap: ($) => $('eli.osmbasedmap'),
  historicphoto: ($) => $('eli.historicphoto'),
  historicmap: ($) => $('eli.historicmap'),
  elevation: ($) => $('eli.elevation'),
  qa: undefined, // don't show these
  other: ($) => $('eli.other'),
};

export interface BasemapGroup {
  id: string;
  label: string;
  sources: ELI[];
}

export async function getAvailableLayers(
  map: Map,
  $: I$,
): Promise<BasemapGroup[]> {
  eliPromise ||= fetch(
    'https://osmlab.github.io/editor-layer-index/imagery.geojson',
  ).then((r) => r.json() as Promise<ELIGeoJson>);
  const geojson = await eliPromise;

  const world = geojson.features
    .filter((x) => !x.geometry)
    .map((x) => x.properties)
    .filter(isValid);

  const nonWorld: ELIGeoJson = {
    features: geojson.features.filter((x) => x.geometry),
    type: 'FeatureCollection',
  };

  const query = whichPolygon<ELI>(nonWorld);

  const local = (query(map.getCenter().toArray(), true) || []).filter(isValid);

  return [
    {
      id: 'best',
      label: $('eli._best'),
      sources: [...local, ...world].filter(isRecommended),
    },
    {
      id: 'local',
      label: $('eli._local'),
      sources: local.filter((layer) => !isRecommended(layer)),
    },
    ...(Object.keys(CATEGORY_LABELS) as EliCategory[])
      .filter((category) => CATEGORY_LABELS[category])
      .map((category) => ({
        id: category,
        label: CATEGORY_LABELS[category]!($),
        sources: world.filter(
          (layer) =>
            !isRecommended(layer) && (layer.category || 'other') === category,
        ),
      })),
  ].filter((group) => group.sources.length);
}

export function changeBasemap(map: Map, layer: ELI) {
  const style = map.getStyle();
  // eslint-disable-next-line dot-notation
  style.sources['basemap'] = {
    type: 'raster',
    tiles: [convertTileUrl(layer.url)],
    tileSize: layer['tile-size'] || 256,
    attribution: [
      layer.attribution &&
        layer.id !== DEFAULT_BASEMAP &&
        layer.attribution.text?.link(layer.attribution.url!),
      'OpenStreetMap contributors'.link('https://osm.org/copyright'),
    ]
      .filter(Boolean)
      .join(' &middot; '),
    maxzoom: layer.max_zoom,
    minzoom: layer.min_zoom,
  };

  map.setStyle(style);
}
