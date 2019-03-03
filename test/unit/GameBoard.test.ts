import { range } from 'lodash';

import {
  Size2d,
} from '../../src/util/Size';

import {
  hardModeGenerator,
  normalModeGenerator,
  easyModeGenerator,

  isSolvable,
} from '../../src/models/GameBoard';

const gameBoardSize: Size2d = { width: 4, height: 4 };

test.each([

  [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0], true, gameBoardSize],
  [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14, 0], false, gameBoardSize],

  ...range(0, 200).map(() => [hardModeGenerator(gameBoardSize), true, gameBoardSize]),
  ...range(0, 200).map(() => [normalModeGenerator(gameBoardSize), true, gameBoardSize]),
  ...range(0, 200).map(() => [easyModeGenerator(gameBoardSize), true, gameBoardSize]),

])('solvability of [%s] should be %s', (values, expectation, size) => {
  expect(isSolvable(size, values)).toBe(expectation);
});
