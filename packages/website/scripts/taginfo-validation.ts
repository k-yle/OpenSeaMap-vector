import type { Schema } from 'taginfo-projects';
import styleJson from '../../../data/public/style.json' with { type: 'json' };

/** walks through an arbitrary JSON structure */
function* walk(node: object, depth = 0): Generator<unknown, void, void> {
  for (const key in node) {
    const value = Reflect.get(node, key);
    yield value;

    if (typeof value === 'object' && value !== null) {
      yield* walk(value, depth + 1);
    }
  }
}

/**
 * checks the auto-generated taginfo file for any keys that might
 * have been missed by the collector script.
 */
export function validateTaginfo(taginfo: Schema) {
  interface SeenMap {
    [key: string]: Set<string>;
  }

  // collect the keys & tags that are actually defined:

  const definedTags: SeenMap = {};
  for (const row of taginfo.tags) {
    definedTags[row.key] ||= new Set();
    if (row.value) definedTags[row.key]!.add(row.value);
  }

  // TODO: also check the navmark renderer's list of icons

  // walk through various files to collect tags and check
  // if they were missed:

  const expectedTags: SeenMap = {};

  const OPERATORS = new Set(['==', '!=']);
  for (const layer of styleJson.layers) {
    for (const value of walk(layer)) {
      // ["get", key]
      if (Array.isArray(value) && value[0] === 'get') {
        expectedTags[value[1]] ||= new Set();
      }

      // ["==", key, value]
      if (
        Array.isArray(value) &&
        value.length === 3 &&
        OPERATORS.has(value[0]) &&
        typeof value[1] === 'string' &&
        typeof value[2] === 'string'
      ) {
        expectedTags[value[1]] ||= new Set();
        expectedTags[value[1]]!.add(value[2]);
      }
    }
  }

  for (const key in expectedTags) {
    if (key.startsWith('_')) {
      delete expectedTags[key];
    }
  }

  const missingKeys = new Set(Object.keys(expectedTags)).difference(
    new Set(Object.keys(definedTags)),
  );
  const missingTags: SeenMap = {};
  for (const key in expectedTags) {
    const missingValues = expectedTags[key]!.difference(
      definedTags[key] || new Set(),
    );
    for (const v of missingValues) {
      missingTags[key] ||= new Set();
      missingTags[key].add(v);
    }
  }

  if (missingKeys.size) {
    throw new Error(
      `Some keys are not defined in taginfo.json: ${[...missingKeys].join('\n')}`,
    );
  }
  if (Object.keys(missingTags).length) {
    const obj = JSON.stringify(
      missingTags, // Sets can't be stringified
      (_, v) => (v instanceof Set ? [...v] : v),
      2,
    );
    throw new Error(`Some tags are not defined in taginfo.json: ${obj}`);
  }
}
