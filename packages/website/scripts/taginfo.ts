import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import type { DateString, Schema } from 'taginfo-projects';
import type { Tags } from 'osm-api';
import { LEGEND } from '../src/data/legend.js';
import { validateTaginfo } from './taginfo-validation.js';

const taginfo: Schema = {
  $schema:
    'https://raw.githubusercontent.com/taginfo/taginfo-projects/master/taginfo-project-schema.json',
  data_format: 1,
  data_url: 'https://kyle.kiwi/OpenSeaMap-vector/taginfo.generated.json',
  data_updated: <DateString>(
    new Date().toISOString().replaceAll(/[-:]|(\.\d+)/g, '')
  ),
  project: {
    name: 'OpenSeaMap-vector',
    description:
      'A rewrite of OpenSeaMap, using vector tiles instead of raster tiles',
    project_url: 'https://kyle.kiwi/OpenSeaMap-vector',
    doc_url: 'https://osm.wiki/OpenSeaMap',
    icon_url: 'https://kyle.kiwi/OpenSeaMap-vector/icon.svg',
    contact_name: 'Kyle Hensel',
    contact_email: 'message @kylenz on OpenStreetMap',
  },
  tags: [
    // not all values are listed here, some are auto-generated further down this file.

    //
    // attributes
    //
    {
      key: 'name',
      description: 'Used for labelling features if seamark:name does not exist',
    },
    {
      key: 'ref',
      description: 'Used for labelling features if seamark:name does not exist',
    },
    {
      key: 'seamark:name',
      description:
        'Used for feature labels. Alternatively, name=* and/or ref=* can be used ',
    },

    ...[
      'network:wikidata',
      'brand:wikidata',
      'operator:wikidata',
      'wikidata',
    ].map((key) => ({
      key,
      description: `If a yacht club has ${key}, we will lookup the wikidata item to find the burgee (flag) image.`,
    })),

    // TODO: temporary, add better docs later:
    { key: 'seamark:topmark:shape', value: 'flag' },
    { key: 'seamark:daymark:shape', value: 'flag' },
    ...[
      'beacon_cardinal',
      'beacon_isolated_danger',
      'beacon_lateral',
      'beacon_safe_water',
      'beacon_special_purpose',
      'buoy_cardinal',
      'buoy_installation',
      'buoy_isolated_danger',
      'buoy_lateral',
      'buoy_safe_water',
      'buoy_special_purpose',
      'daymark',
      'fog_signal',
      'notice',
      'light',
      'light_minor',
      'light_major',
      'light_float',
      'light_vessel',
      'virtual_aton',
      'platform',
      'topmark',
    ].map((value) => ({ key: 'seamark:type', value })),
    { key: 'man_made', value: 'lighthouse' },
    { key: 'man_made', value: 'offshore_platform' },
  ],
};

function renderTags(tags: Tags) {
  const str = Object.entries(tags)
    .map(([k, v]) => `${k}=${v}`)
    .join(' + ');
  return Object.entries(tags).length > 1 ? `(${str})` : str;
}

function loadFromLegend() {
  const hiddenTags: { [key: string]: { [value: string]: Set<string> } } = {};
  for (const category of LEGEND) {
    for (const item of category.items) {
      for (const [index, tags] of item.tags.entries()) {
        let description = `‘${item.label}’ is rendered if ${renderTags(tags)}.`;
        const others = item.tags.filter((t) => t !== tags).map(renderTags);
        if (others.length) {
          const prefix = index
            ? 'The preferred tagging is'
            : 'Alternative tagging is also supported';
          description += ` ${prefix}: ${others.join(' or ')}`;
        }

        for (const [key, value] of Object.entries(tags)) {
          taginfo.tags.push({
            key,
            value: value === '*' ? undefined : value,
            description,
            icon_url: item.icon || undefined,
          });
        }

        for (const matchTags of item.hiddenIf || []) {
          for (const [k, v] of Object.entries(matchTags)) {
            hiddenTags[k] ||= {};
            hiddenTags[k][v] ||= new Set();
            hiddenTags[k][v].add(item.label);
          }
        }
        for (const key of item.labelAttributes || []) {
          taginfo.tags.push({
            key,
            description: `This tag is used in the label of ‘${item.label}’ features.`,
            icon_url: item.icon || undefined,
          });
        }
      }
    }
  }

  for (const [key, values] of Object.entries(hiddenTags)) {
    for (const [value, features] of Object.entries(values)) {
      taginfo.tags.push({
        key,
        value,
        description: `Some features are hidden from the map if this tag is present (specifically: ${[...features].join(', ')})`,
      });
    }
  }
}

async function loadFromPlanetilerJavaFile() {
  const javaFile = await fs.readFile(
    join(import.meta.dirname, '../../../data/planetiler/Seamarks.java'),
    'utf8',
  );
  const [, attributeKeys, attributeKeyPrefixes] = javaFile
    .matchAll(/Set\.of\(([^)]+)\);/g)
    .map((item): string[] =>
      // eslint-disable-next-line no-eval -- safe, this is code from our own repo
      eval(`[${item[1]}]`),
    );

  const keys = [
    ...attributeKeys!,
    ...attributeKeyPrefixes!.map((key) => `${key}*`),
  ];

  const existing = new Set(taginfo.tags.map((item) => item.key));
  for (const key of keys) {
    if (existing.has(key)) continue;
    taginfo.tags.push({
      key,
      description:
        'Shown as an attribute in the popup when a seamark feature is selected',
    });

    // TODO: some of these are used for other purposes. Should that be mentioned (maybe in the legend files)?
  }
}

loadFromLegend();
await loadFromPlanetilerJavaFile();
validateTaginfo(taginfo);

await fs.writeFile(
  join(import.meta.dirname, '../../../data/public/taginfo.generated.json'),
  JSON.stringify(taginfo, null, 2),
);
