import type { MapGeoJSONFeature } from 'maplibre-gl';
import type { OsmFeatureType } from 'osm-api';
import { bigintToOsmId, osmIdToUrl, osmIdtoEditorUrl } from '../util/osm.js';
import iconNode from '../static/element_node.svg?url';
import iconWay from '../static/element_way.svg?url';
// import iconArea from '../static/element_node.svg?url';
import iconRelation from '../static/element_relation.svg?url';

const ICONS: Record<OsmFeatureType, string> = {
  node: iconNode,
  way: iconWay,
  relation: iconRelation,
};

export const MapPopup: React.FC<{
  feature: MapGeoJSONFeature;
}> = ({ feature }) => {
  const label = feature.properties['seamark:type'];
  const id = bigintToOsmId(feature.id!);

  const usDodRef = feature.properties['seamark:light:reference'];
  const { wikidata, wikipedia } = feature.properties;
  return (
    <>
      <h2>
        <img src={ICONS[id.type]} alt={id.type} style={{ height: '1lh' }} />{' '}
        {label}
      </h2>
      <a href={osmIdToUrl(id)} target="_blank" rel="noopener">
        OSM
      </a>
      {' | '}
      <a href={osmIdtoEditorUrl(id)} target="_blank" rel="noopener">
        iD
      </a>
      {usDodRef && (
        <>
          {' | '}
          <a
            href={`https://list.lighting/${usDodRef}`}
            target="_blank"
            rel="noopener"
          >
            List of Lights
          </a>
        </>
      )}
      {wikipedia ? (
        <>
          {' | '}
          <a
            href={`https://en.wikipedia.org/wiki/${wikipedia}`}
            target="_blank"
            rel="noopener"
          >
            Wikipedia
          </a>
        </>
      ) : wikidata ? (
        <>
          {' | '}
          <a
            href={`https://wikidata.org/wiki/${wikidata}`}
            target="_blank"
            rel="noopener"
          >
            Wikidata
          </a>
        </>
      ) : null}
      <pre style={{ textWrap: 'auto' }}>
        {Object.entries(feature.properties)
          .filter(([key]) => !key.startsWith('_'))
          .toSorted(([a], [b]) => a.localeCompare(b))
          .map((kv) => kv.join(' = '))
          .join('\n')}
      </pre>
    </>
  );
};
