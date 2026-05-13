export type Column = 'leftmost' | 'rightmost' | 'any';

export type PreferenceFunction<T> = (item: T) => Column;

/**
 * Given an array which is rendered as a table of n columns,
 * this function sorts the array to move around items that
 * must be in the leftmost or rightmost column.
 *
 * If there is an imbalence of items, the sorted array may
 * contain gaps (`undefined`), and the sorted array may be
 * longer than the unsorted array.
 */
export function disperseColumns<T>(
  unsorted: T[],
  getPreference: PreferenceFunction<T>,
  columnCount: number,
): (T | undefined)[] {
  const stack: Record<Column, T[]> = {
    leftmost: [],
    rightmost: [],
    any: [],
  };
  for (const item of unsorted) {
    stack[getPreference(item)].push(item);
  }

  const sorted: (T | undefined)[] = [];
  for (let i = 0; Object.values(stack).flat().length; i++) {
    const isLeftmost = !(i % columnCount);
    const isRightmost = !((i + 1) % columnCount);

    if (isLeftmost && !!stack.leftmost.length) {
      // this is the leftmost column, and there are still
      // some items that must be in the leftmost column.
      sorted.push(stack.leftmost.pop());
    } else if (isRightmost && !!stack.rightmost.length) {
      // this is the rightmost column, and there are still
      // some items that must be in the rightmost column.
      sorted.push(stack.rightmost.pop());
    } else {
      // either:
      //  - this is a middle column; or
      //  - this is an outer column, but there is nothing
      //    left that must be in this column.
      sorted.push(stack.any.pop());
    }
  }

  return sorted;
}
