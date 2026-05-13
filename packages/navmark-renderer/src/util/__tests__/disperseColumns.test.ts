import { describe, expect, it } from 'vitest';
import {
  type PreferenceFunction,
  disperseColumns,
} from '../disperseColumns.js';

type MyList = 'L' | 'R' | 'a';

const getPreference: PreferenceFunction<MyList> = (item: MyList) => {
  if (item === 'L') return 'leftmost';
  if (item === 'R') return 'rightmost';
  if (item === 'a') return 'any';
  throw new Error('invalid item');
};

/** joins `0,1,2,3,4,5,6,7,8` into `01,23,45,67,8` given `size=2` */
function joinGrouped(input: (string | undefined)[], cols: number): string {
  return input
    .reduce<string[]>((groups, _, i) => {
      if (!(i % cols)) {
        groups.push(
          input
            .slice(i, i + cols)
            .map((item) => item || '.')
            .join(''),
        );
      }
      return groups;
    }, [])
    .join(' ');
}

describe(disperseColumns, () => {
  it.each`
    input             | cols | output
    ${'a'}            | ${3} | ${'a'}
    ${'aaaaa'}        | ${3} | ${'aaa aa'}
    ${'LL'}           | ${1} | ${'L L'}
    ${'RL'}           | ${2} | ${'LR'}
    ${'RRLL'}         | ${2} | ${'LR LR'}
    ${'LL'}           | ${3} | ${'L.. L' /** there's a gap */}
    ${'LRR'}          | ${2} | ${'LR .R'}
    ${'LLLLaaaaRRRR'} | ${3} | ${'LaR LaR LaR LaR'}
    ${'aaaRR'}        | ${3} | ${'aaR a.R'}
    ${'LLL'}          | ${3} | ${'L.. L.. L'}
  `('$input ÷ $cols → $output', ({ input, cols, output }) => {
    const inputList = [...input] as MyList[];

    const outputList = disperseColumns(inputList, getPreference, cols);

    expect(joinGrouped(outputList, cols)).toBe(output);
  });
});
