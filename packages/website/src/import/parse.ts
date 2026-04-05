/* eslint-disable dot-notation */
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import type { FeatureCollection, Point } from 'geojson';

// https://opendata.transport.nsw.gov.au/data/dataset/maritime-nsw-public-mooring/resource/ebb6c4c1-f11d-41b0-97dd-df1ff873e956
// https://opendata.transport.nsw.gov.au/data/dataset/maritime-nsw-aid-navigation/resource/ce820687-fa38-47a2-92f5-138cc38fa21f

// icons.json from https://www.arcgis.com/sharing/rest/content/items/edb9b3a027354250a5e025b0a80e198b/data?f=json
// layer.geojson from ?

const iconsFile = JSON.parse(
  await fs.readFile(join(import.meta.dirname, 'icons.json'), 'utf8'),
);

const list =
  iconsFile.layers[0].layerDefinition.drawingInfo.renderer.uniqueValueGroups[0]
    .classes;

const codeToLabel = Object.fromEntries(
  list.map((item: any) => [+item.values[0][0], item.label]),
);

type Tags = Record<string, string | undefined>;

function labelToTags(label: string) {
  /** this is mutated as each word is parsed */
  let remaining = label
    .replaceAll(' - ', ' ')
    .replaceAll(/[.*]/g, ' ')
    .replaceAll('  ', ' ')
    .toUpperCase();

  /** @returns true if the substring is found, and then removes the substring from the original string */
  function pop(substring: string) {
    const re = new RegExp(String.raw`\b${substring}\b`);
    if (re.test(remaining)) {
      remaining = remaining.replace(re, '').replaceAll('  ', ' ').trim();
      return true;
    }
    return false;
  }

  const tags: Tags = {};

  const type = pop('BUOY')
    ? 'buoy'
    : pop('BEACON')
      ? 'beacon'
      : pop('MARK')
        ? 'daymark'
        : undefined;
  pop('MARK'); // discard mark if buoy was also specified - buoy takes precedence

  if (!type) {
    console.warn('no type', label);
    return tags;
  }

  const hasTopmark = pop('WITH TM') || pop('WITH TOP');
  pop('NO TOP'); // discard

  const isLit = [pop('LIT'), pop('LIGHT'), pop('LIG')].find(Boolean);

  if (pop('NTM')) {
    // tags['fix me'] = 'check the local Notice-to-Mariners bulletin: this feature may be temporarily moved, removed, or altered';
  }

  const isAqua = pop('AQUA'); // aqua is both a type and a shape, so handle it specially.

  const shape = pop('CAN')
    ? 'can'
    : pop('PILLAR')
      ? 'pillar'
      : pop('CONICAL')
        ? 'conical'
        : pop('PILE')
          ? 'pile'
          : pop('PIPE')
            ? 'pole'
            : isAqua
              ? 'aqua'
              : undefined;
  pop('OBLONG'); // discard

  const colours = [];
  if (pop('YELLOW') || pop('YEL')) colours.push('yellow');
  if (pop('GREEN')) colours.push('green');
  if (pop('RED')) colours.push('red');
  if (pop('ORANGE')) colours.push('orange');
  if (pop('BLUE')) colours.push('blue');
  if (pop('WHITE')) colours.push('white');
  const colour = colours.join(';') || undefined;

  if (pop('CARDINAL') || pop('CARD')) {
    const direction =
      pop('NORTH') || pop('NTH')
        ? 'north'
        : pop('SOUTH') || pop('STH')
          ? 'south'
          : pop('EAST')
            ? 'east'
            : pop('WEST')
              ? 'west'
              : undefined;

    if (!direction) throw new Error('cardinal unknown dir');

    // cardinal buoys must have a topmark
    tags['seamark:topmark:colour'] = 'black';
    tags['seamark:topmark:shape'] = {
      north: '2 cones up',
      south: '2 cones down',
      east: '2 cones base together',
      west: '2 cones point together',
    }[direction];

    tags['seamark:type'] = `${type}_cardinal`;
    tags[`seamark:${tags['seamark:type']}:category`] = direction;
    tags[`seamark:${tags['seamark:type']}:colour`] = {
      north: 'black;yellow',
      south: 'yellow;black',
      east: 'black;yellow;black',
      west: 'yellow;black;yellow',
    }[direction];
    tags[`seamark:${tags['seamark:type']}:colour_pattern`] = 'horizontal';
    if (isLit) {
      tags['seamark:light:colour'] = 'white';
      tags['seamark:light:group'] = {
        north: '1',
        south: '6',
        east: '3',
        west: '9',
      }[direction];
    }
  }

  if (pop('SAFE WATER')) {
    tags['seamark:type'] = `${type}_safe_water`;
    if (hasTopmark) {
      tags['seamark:topmark:shape'] = 'sphere';
      tags['seamark:topmark:colour'] = 'white'; // TODO: confirm
    }
    if (isLit) tags['seamark:light:colour'] = 'white'; // TODO: confirm + patterns?
  }

  if (pop('SPECIAL') || pop('SPEC')) {
    tags['seamark:type'] =
      type === 'daymark' ? type : `${type}_special_purpose`;
    tags[`seamark:${tags['seamark:type']}:colour`] = 'yellow'; // implied by TfNSW's icon
    if (hasTopmark) {
      tags['seamark:topmark:shape'] = 'x-shape';
      tags['seamark:topmark:colour'] = 'yellow'; // implied by TfNSW's icon
    }
    if (isLit) tags['seamark:light:colour'] = 'yellow'; // implied by TfNSW's icon
  }

  if (isAqua) {
    // NSW thing, no specific seamark tag for it
    tags['seamark:type'] ||= `${type}_special_purpose`; // preserve existing value
    tags[`seamark:${tags['seamark:type']}:colour`] = colour;
    if (hasTopmark) tags['seamark:topmark:shape'] = 'unknown';
    if (isLit) tags['seamark:light:colour'] = 'unknown';
  }

  if (pop('MOORING')) {
    if (pop('STEEL')) {
      // massive one
      tags['seamark:type'] = `${type}_installation`;
    } else {
      // normal tiny one
      tags['seamark:type'] = 'mooring';
      tags[`seamark:${tags['seamark:type']}:category`] = type;
    }
    tags[`seamark:${tags['seamark:type']}:colour`] = colour;
    if (hasTopmark) tags['seamark:topmark:shape'] = 'unknown';
    if (isLit) tags['seamark:light:colour'] = 'unknown';
  }

  if (pop('ISO DANGER') || pop('ISOLATED DANGER')) {
    tags['seamark:type'] = `${type}_isolated_danger`;
    tags[`seamark:${tags['seamark:type']}:colour`] = 'black;red;black';
    tags[`seamark:${tags['seamark:type']}:colour_pattern`] = 'horizontal';
    if (hasTopmark) tags['seamark:topmark:shape'] = '2 spheres';
    if (hasTopmark) tags['seamark:topmark:colour'] = 'black';
    if (isLit) tags['seamark:light:colour'] = 'white'; // TODO: confirm + patterns?
  }

  const side = pop('PORT')
    ? 'port'
    : pop('STBD') || pop('STARBOARD')
      ? 'starboard'
      : undefined;

  if (pop('PREFERRED CHANNEL TO') || pop('PREF CHANNEL TO')) {
    tags['seamark:type'] = `${type}_lateral`;
    tags[`seamark:${tags['seamark:type']}:category`] =
      `preferred_channel_${side}`;

    if (hasTopmark) throw new Error('not supported yet');
  } else if (side) {
    tags['seamark:type'] = type === 'daymark' ? type : `${type}_lateral`;
    tags[`seamark:${tags['seamark:type']}:category`] = side;
    tags[`seamark:${tags['seamark:type']}:colour`] =
      side === 'port' ? 'red' : 'green';

    if (hasTopmark) {
      tags['seamark:topmark:colour'] = side === 'port' ? 'red' : 'green'; // implied by TfNSW's icon
      tags['seamark:topmark:shape'] =
        side === 'port' ? 'cylinder' : 'cone, point up';
    }
    if (isLit) {
      tags['seamark:light:colour'] = side === 'port' ? 'red' : 'green';
    }
  }

  if (!tags['seamark:type'] && !tags['man_made']) {
    // still not type - so give it a generic tag
    tags['seamark:type'] = `${type}_special_purpose`;
    if (hasTopmark) tags['seamark:topmark:shape'] = 'unknown';
    if (isLit) tags['seamark:light:colour'] = 'unknown';
  }

  tags[`seamark:${tags['seamark:type']}:shape`] = shape;
  tags[`seamark:${tags['seamark:type']}:material`] = pop('STEEL') // steel might already have been popped early
    ? 'steel'
    : undefined;

  if (hasTopmark) tags['seamark:topmark:shape'] ||= 'unknown';
  if (isLit) {
    tags['seamark:light:colour'] ||= 'unknown';
  }

  const isFront = pop('FRONT');
  const isRear = pop('REAR');
  if (pop('LEAD') || pop('LEADING')) {
    tags[`seamark:${tags['seamark:type']}:category`] = 'leading';
    if (isFront) tags[`seamark:${tags['seamark:type']}:category`] += ';front';
    if (isRear) tags[`seamark:${tags['seamark:type']}:category`] += ';rear';

    if (isLit) {
      tags['seamark:light:category'] = 'leading';
      if (isFront) tags['seamark:light:category'] += ';front';
      if (isRear) tags['seamark:light:category'] += ';rear';
    }
    if (pop('TRIANGLE')) {
      tags['seamark:topmark:shape'] =
        `triangle, point ${isFront ? 'up' : 'down'}`; // implied by TfNSW's icon
    }
  }

  // miscelaneous

  if (pop('PRIVATE')) tags['operator:type'] = 'private';

  tags['description'] = label;

  // ACK & discard junk
  pop('BEEHIVE');
  pop('SECTORED');

  if (remaining) {
    console.warn(`leftover words: ${remaining}\t`, [label]);
  }

  return tags;
}

const tags: Record<string, Tags> = {};
for (const [code, label] of Object.entries(codeToLabel)) {
  tags[code] = labelToTags(label);
}

await fs.writeFile(
  join(import.meta.dirname, './label-to-tags.json'),
  JSON.stringify(tags, null, 2),
);

const dataFile: FeatureCollection<
  Point,
  {
    MARITIME_ASSET_ID: string | null;
    ASSET_OWNER: string;
    PURPOSE: 'Aid to Navigation';
    TYPE: number;
    POSITION_ACCURACY: 'Survey DGPS' | `Non-DGPS (${string})` | 'Unknown';
  }
> = JSON.parse(
  await fs.readFile(join(import.meta.dirname, 'layer.geojson'), 'utf8'),
);

const OPERATORS: Record<string, [name?: string, qId?: string, type?: string]> =
  {
    'Port Authority of NSW': [
      'Port Authority of New South Wales',
      'Q60742921',
      '',
    ],
    'Transport (Maritime)': ['Transport for NSW', 'Q7834923', ''],
    'Transport (Roads)': ['Transport for NSW', 'Q7834923', ''],
    'Australian Maritime Safety Authority': [
      'Australian Maritime Safety Authority',
      'Q781582',
      '',
    ],
    WaterNSW: ['WaterNSW', 'Q65049612', ''],
    'Department of Planning and Environment': [
      'Department of Planning and Environment',
      'Q65063686',
      '',
    ],
    'Department of Primary Industries (Fisheries)': [
      'Department of Primary Industries',
      'Q5260456',
      '',
    ],
    'Royal Australian Navy': ['Royal Australian Navy', 'Q741691', ''],
    'Sydney Airport Corporation Ltd': [
      'Sydney Airports Corporation Limited',
      'Q4121167',
      '',
    ],
    'Department of Primary Industries (Marine Parks)': [
      'Department of Primary Industries',
      'Q5260456',
      '',
    ],
    'NSW National Parks and Wildlife Service': [
      'NSW National Parks and Wildlife Service',
      'Q108872274',
      '',
    ],
    'Public Works Advisory': ['NSW Public Works', 'Q6955395', ''],

    'Local Council': [undefined, undefined, 'government'],
    Private: [undefined, undefined, 'private'],
    Unknown: ['', '', ''],
    null: ['', '', ''],
  };

for (const feature of dataFile.features) {
  if (!feature.geometry) continue;
  const attr = feature.properties;

  // tags from the type
  const newTags = {
    ...tags[attr.TYPE],
  };

  // ref
  if (attr.MARITIME_ASSET_ID) {
    newTags['ref'] = attr.MARITIME_ASSET_ID.match(/(\d+)$/)?.[1];
    newTags['seamark:name'] = newTags['ref']; // for legacy apps
    if (!newTags['ref']) {
      console.warn('could not parse', attr.MARITIME_ASSET_ID);
    }
  }

  // operator
  const op = OPERATORS[attr.ASSET_OWNER];
  if (op) {
    newTags['operator'] = op[0] || undefined;
    newTags['operator:wikidata'] = op[1] || undefined;
    newTags['operator:type'] = op[2] || undefined;
  } else {
    console.error('unknown operator', attr.ASSET_OWNER);
  }

  // if (attr.ASSET_OWNER.includes('Fisheries')) {
  //   newTags['ref'] = 'FAD';
  //   newTags['seamark:name'] = 'FAD';
  //   newTags['website'] =
  //     'https://www.dpi.nsw.gov.au/fishing/recreational/resources/fish-aggregating-devices';
  // }

  // since this dataset does not have unique IDs,
  // create a hash of every attribute and the location,
  // and use that as the ID. if attribute is updated or
  // moved, then the ID will change.
  const objForHash = {
    lat: feature.geometry.coordinates[1],
    lon: feature.geometry.coordinates[0],
    ...attr,
  };
  const hashContent = new URLSearchParams(
    Object.entries(objForHash)
      .toSorted((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => [k, `${v}`]),
  ).toString();
  const hash = createHash('sha256')
    .update(hashContent)
    .digest('hex')
    .slice(0, 6);

  newTags['ref:AU-NSW:seamark'] = hash;

  feature.properties = newTags as never;
}

await fs.writeFile(
  join(import.meta.dirname, 'final.geo.json'),
  JSON.stringify(dataFile, null, 2),
);
