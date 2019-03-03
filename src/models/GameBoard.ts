
import assert from 'assert';
import lodash, { range } from 'lodash';

const defaultFieldSize = 4;

export interface Size {
  width: number;
  height: number;
}

export interface Vector2d {
  x: number;
  y: number;
}

export interface GameBoard {
  size: Size;
  values: number[];
}

export function init(params?: {
  size?: Size,
  generator?: (size: Size) => number[],
}): GameBoard {
  const {
    size = {
      width: defaultFieldSize,
      height: defaultFieldSize,
    },
    generator = normalModeGenerator,
  } = params || {};

  const values = generator(size);

  const gameBoard = {
    size,
    values,
    holePos: indexToVec2d(size, values.indexOf(0)),
  };

  assertIsValid(gameBoard);

  return gameBoard;
}

function assertIsDirectionValid(dir: Vector2d) {
  assert(-1 <= dir.x && dir.x <= 1, 'direction vector x should be in range [-1..1]');
  assert(-1 <= dir.y && dir.y <= 1, 'direction vector y should be in range [-1..1]');
  assert(
    Math.abs(dir.x) !== Math.abs(dir.y),
    'direction vector should be done only in vertical or horizontal direction, not diagonal',
  );
}

export function getHolePos(gameBoard: GameBoard): Vector2d {
  assertIsValid(gameBoard);
  return indexToVec2d(gameBoard.size, gameBoard.values.indexOf(0));
}

export function getHoleMoveDirs(gameBoard: GameBoard): Vector2d[] {
  assertIsValid(gameBoard);

  const holePos = indexToVec2d(gameBoard.size, gameBoard.values.indexOf(0));

  const isValid = (dir: Vector2d) =>
    isVec2dInBounds(gameBoard.size, addVec2d(holePos, dir));

  const dirs = [
    { x: -1, y: 0 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ];

  return dirs.filter(isValid);
}

export function canMoveHoleTo(gameBoard: GameBoard, dir: Vector2d): boolean {
  assertIsValid(gameBoard);
  assertIsDirectionValid(dir);

  const holePos = indexToVec2d(gameBoard.size, gameBoard.values.indexOf(0));
  const newHolePos = addVec2d(holePos, dir);
  return isVec2dInBounds(gameBoard.size, newHolePos);
}

export function moveHoleTo(gameBoard: GameBoard, dir: Vector2d): GameBoard {
  assertIsValid(gameBoard);
  assertIsDirectionValid(dir);

  const {
    size,
    values,
  } = gameBoard;

  const holePos = indexToVec2d(size, values.indexOf(0));
  const newHolePos = addVec2d(holePos, dir);

  assertIsVec2dInBounds(size, newHolePos);

  const newValues = [...values];

  const indexOfValueA = vec2dToIndex(size, holePos);
  const indexOfValueB = vec2dToIndex(size, newHolePos);

  [newValues[indexOfValueA], newValues[indexOfValueB]] =
    [newValues[indexOfValueB], newValues[indexOfValueA]];

  return {
    size,
    values: newValues,
  };
}

export const hardModeGenerator = randomGenerator;
export const normalModeGenerator = (size: Size) => backwordsGenerator(size, 160);
export const easyModeGenerator = (size: Size) => backwordsGenerator(size, 20);

function randomGenerator(size: Size): number[] {
  const maxAttempts = 1000;
  let attempt = 0;

  while (attempt < maxAttempts) {
    const values = lodash(range(0, size.width * size.height)).shuffle().value();

    if (isSolvable(size, values)) {
      return values;
    }

    attempt += 1;
  }

  throw new Error(
    `something goes wrong, system can not generate solvable preset after ${maxAttempts} iterations`,
  );
}

function backwordsGenerator(size: Size, steps: number): number[] {
  let tempGameBoard = init({
    size,
    generator: () => lodash(range(1, size.width * size.height)).concat(0).value(),
  });

  for (let step = 0; step < steps; step += 1) {
    const dirs = getHoleMoveDirs(tempGameBoard);
    const dir = lodash.sample(dirs);

    tempGameBoard = moveHoleTo(tempGameBoard, <Vector2d>dir);
  }

  return [...tempGameBoard.values];
}

function isVec2dInBounds(size: Size, vec: Vector2d) {
  return (
    (0 <= vec.x && vec.x < size.width) &&
    (0 <= vec.y && vec.y < size.height)
  );
}

function assertIsVec2dInBounds({ width, height }: Size, { x, y }: Vector2d) {
  assert(0 <= x && x < width, `x should be in range [0..${width}]`);
  assert(0 <= y && y < height, `y should be in range [0..${height}]`);
}

function assertIsValidIndex(index: number, { width, height }: Size) {
  assert(0 <= index && index < width * height, `index should be in range [0..${width * height}]`);
}

function assertIsValidSize(size: Size) {
  assert(2 <= size.width, 'width should be in range [2..infinity]');
  assert(2 <= size.height, 'height should be in range [2..infinity]');
}

function vec2dToIndex(size: Size, vec: Vector2d) {
  assertIsVec2dInBounds(size, vec);

  return vec.y * size.width + vec.x;
}

function indexToVec2d(size: Size, index: number) {
  assertIsValidIndex(index, size);

  return {
    y: Math.floor(index / size.width),
    x: index % size.width,
  };
}

export function addVec2d(vecA: Vector2d, vecB: Vector2d) {
  return { x: vecA.x + vecB.x, y: vecA.y + vecB.y };
}

function assertIsValid({ size, values }: GameBoard) {
  assertIsValidSize(size);
  assertIsValidValues(size, values);
}

function assertIsValidValues({ width, height }: Size, values: number[]) {
  const maxValue = width * height;

  assert(values.length === maxValue, 'game board values are invalid');

  const sum = lodash(values).filter(value => 0 <= value && value < maxValue).sum();
  const checkSum = lodash(lodash.range(1, maxValue)).sum();

  assert(sum === checkSum, 'game board values are invalid');

  /* assert(
      gridValues && gridValues.length === gridSize.width * gridSize.height,
      `length of grid values should be [width x height]`,
    ); */
}

// note: https://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html
export function isSolvable(gridSize: Size, gridValues: number[]): boolean {
  assertIsValidSize(gridSize);
  assertIsValidValues(gridSize, gridValues);

  const holeRow = Math.floor(gridValues.indexOf(0) / gridSize.width);
  const holeRowFromBottom = gridSize.height - holeRow;
  const totalInversions = lodash(gridValues).map(countInversions).sum();

  return gridSize.width % 2 === 0
    ? holeRowFromBottom % 2 !== totalInversions % 2
    : totalInversions % 2 === 0;
}

function countInversions(gridValue: number, position: number, gridValues: number[]) {
  return lodash(gridValues)
    .slice(position + 1)
    .filter(value => value > 0 && gridValue > value)
    .value()
    .length;
}
