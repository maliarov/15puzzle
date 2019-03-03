import { range } from 'lodash';

import {
  Size,

  hardModeGenerator,
  normalModeGenerator,
  easyModeGenerator,

  isSolvable,
} from '../../src/models/GameBoard';

const gameBoardSize: Size = { width: 4, height: 4 };

(<[Size, number[], boolean][]>[
  [gameBoardSize, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0], true],
  [gameBoardSize, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14, 0], false],

  ...range(0, 100).map(() => [gameBoardSize, hardModeGenerator(gameBoardSize), true]),
  ...range(0, 100).map(() => [gameBoardSize, normalModeGenerator(gameBoardSize), true]),
  ...range(0, 100).map(() => [gameBoardSize, easyModeGenerator(gameBoardSize), true]),

]).forEach(([size, values, expectation]) => {
  test(`solvability of [${values}] should be ${expectation}`, () => {
    expect(isSolvable(size, values)).toBe(expectation);
  });
});
