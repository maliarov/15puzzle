
import assert from 'assert';
import lodash, { range } from 'lodash';

import {
  Size2d,
  projectSize2dTo1d,
} from '../util/Size';

import {
  Vector2d,
  assertIsVec2dInBounds,
  projectVec1dTo2d,
  projectVec2dTo1d,
  addVec2d,
} from '../util/Vector';

const maxGeneratorAttempts = 1000;

export const defaultSize = 4;

export type GameBordGenerator = (size: Size2d) => number[];

export interface GameBoard {
  size: Size2d;
  values: number[];
}

export function init(params?: {
  size?: Size2d,
  generator?: GameBordGenerator,
}): GameBoard {
  const {
    size = {
      width: defaultSize,
      height: defaultSize,
    },
    generator = normalModeGenerator,
  } = params || {};

  const values = generator(size);

  const gameBoard = {
    size,
    values,
  };

  assertIsValid(gameBoard);

  return gameBoard;
}

function assertIsDirectionValid(dir: Vector2d) {
  assert(-1 <= dir.x && dir.x <= 1, 'direction vector x should be in [-1..1] range');
  assert(-1 <= dir.y && dir.y <= 1, 'direction vector y should be in [-1..1] range');
  assert(
    Math.abs(dir.x) !== Math.abs(dir.y),
    'direction vector should be done only in vertical or horizontal direction, not diagonal',
  );
}

export function getEmptySpacePos(gameBoard: GameBoard): Vector2d {
  assertIsValid(gameBoard);
  return projectVec1dTo2d(gameBoard.size, gameBoard.values.indexOf(0));
}

export function getEmptySpaceMoveDirs(gameBoard: GameBoard): Vector2d[] {
  assertIsValid(gameBoard);

  const emptySpacePos = projectVec1dTo2d(gameBoard.size, gameBoard.values.indexOf(0));

  const isValid = (dir: Vector2d) =>
    isVec2dInBounds(gameBoard.size, addVec2d(emptySpacePos, dir));

  const dirs = [
    { x: -1, y: 0 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ];

  return dirs.filter(isValid);
}

export function canMoveEmptySpaceTo(gameBoard: GameBoard, dir: Vector2d): boolean {
  assertIsValid(gameBoard);
  assertIsDirectionValid(dir);

  const emptySpacePos = projectVec1dTo2d(gameBoard.size, gameBoard.values.indexOf(0));
  const newEmptySpacePos = addVec2d(emptySpacePos, dir);
  return isVec2dInBounds(gameBoard.size, newEmptySpacePos);
}

export function moveEmptySpaceTo(gameBoard: GameBoard, dir: Vector2d): GameBoard {
  assertIsValid(gameBoard);
  assertIsDirectionValid(dir);

  const {
    size,
    values,
  } = gameBoard;

  const emptySpacePos = projectVec1dTo2d(size, values.indexOf(0));
  const newEmptySpacePos = addVec2d(emptySpacePos, dir);

  assertIsVec2dInBounds(size, newEmptySpacePos);

  const newValues = [...values];

  const indexOfValueA = projectVec2dTo1d(size, emptySpacePos);
  const indexOfValueB = projectVec2dTo1d(size, newEmptySpacePos);

  [newValues[indexOfValueA], newValues[indexOfValueB]] =
    [newValues[indexOfValueB], newValues[indexOfValueA]];

  return {
    size,
    values: newValues,
  };
}

export function isSolved(gameBoard: GameBoard): boolean {
  assertIsValid(gameBoard);
  return isSolvedSet(gameBoard.values);
}

function isSolvedSet(values: number[]): boolean {
  const normalizedValues = [
    ...values.slice(-1),
    ...values.slice(0, -1),
  ];

  return normalizedValues.every((value, index) => value === index);
}

export const hardModeGenerator = randomGenerator;
export const normalModeGenerator = (size: Size2d) => backwordsGenerator(size, 160);
export const easyModeGenerator = (size: Size2d) => backwordsGenerator(size, 20);

function randomGenerator(size: Size2d): number[] {
  let attempt = 0;
  while (attempt < maxGeneratorAttempts) {
    const values = lodash(range(0, projectSize2dTo1d(size))).shuffle().value();

    if (isSolvable(size, values) && !isSolvedSet(values)) {
      return values;
    }

    attempt += 1;
  }

  throw new Error(
    `something goes wrong, randomGenerator can not generate solvable preset after ${maxGeneratorAttempts} iterations`,
  );
}

function backwordsGenerator(size: Size2d, steps: number): number[] {
  let tempGameBoard = init({
    size,
    generator: () => lodash(range(1, projectSize2dTo1d(size))).concat(0).value(),
  });

  let attempt = 0;

  while (attempt < maxGeneratorAttempts) {
    for (let step = 0; step < steps; step += 1) {
      const dirs = getEmptySpaceMoveDirs(tempGameBoard);
      const dir = lodash.sample(dirs);

      tempGameBoard = moveEmptySpaceTo(tempGameBoard, <Vector2d>dir);
    }

    if (!isSolvedSet(tempGameBoard.values)) {
      return [...tempGameBoard.values];
    }

    attempt += 1;
  }

  throw new Error(
    `something goes wrong, backwordsGenerator can not generate solvable preset after ${maxGeneratorAttempts} iterations`,
  );
}

function isVec2dInBounds(size: Size2d, vec: Vector2d) {
  return (
    (0 <= vec.x && vec.x < size.width) &&
    (0 <= vec.y && vec.y < size.height)
  );
}

function assertIsValidSize(size: Size2d) {
  assert(2 <= size.width, 'width should be in [2..infinity) range');
  assert(2 <= size.height, 'height should be in [2..infinity) range');
}

function assertIsValid({ size, values }: GameBoard) {
  assertIsValidSize(size);
  assertIsValidValues(size, values);
}

function assertIsValidValues(size: Size2d, values: number[]) {
  const dimension = projectSize2dTo1d(size);

  assert(
    values.length === dimension,
    `game board values are invalid, set should contains ${dimension} values`,
  );

  const sum = lodash(values).filter(value => 0 <= value && value < dimension).sum();
  const checkSum = lodash(lodash.range(1, dimension)).sum();

  assert(
    sum === checkSum,
    `game board values are invalid, set should contains all uniq values in [0...${dimension}) range`,
  );
}

// note: https://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html
export function isSolvable(size: Size2d, values: number[]): boolean {
  assertIsValidSize(size);
  assertIsValidValues(size, values);

  const emptySpaceRow = Math.floor(values.indexOf(0) / size.width);
  const emptySpaceRowFromBottom = size.height - emptySpaceRow;
  const totalInversions = lodash(values).map(countInversions).sum();

  return size.width % 2 === 0
    ? emptySpaceRowFromBottom % 2 !== totalInversions % 2
    : totalInversions % 2 === 0;
}

function countInversions(gridValue: number, position: number, gridValues: number[]) {
  return lodash(gridValues)
    .slice(position + 1)
    .reduce((accum, value) => accum + Number(value > 0 && gridValue > value), 0);
}
