
import assert from 'assert';
import _, { range } from 'lodash';

const defaultFieldSize = 4;

export interface Size {
    width: number;
    height: number;
}

export interface Vector2d {
    x: number;
    y: number
}

export interface GameBoard {
    size: Size;
    holePos: Vector2d;
    cells: number[][];
}

export function init(params?: {
    holePos?: Vector2d,
    size?: Size,
    generator?: (width: number, height: number) => number[][],
}): GameBoard {
    const {
        holePos: { x, y } = {
            x: defaultFieldSize - 1,
            y: defaultFieldSize - 1,
        },
        size: { width, height } = {
            width: defaultFieldSize,
            height: defaultFieldSize,
        },
        generator = normalModeGenerator,
    } = params || {};

    assert(2 <= width, `width should be in range [0..infinity]`);
    assert(2 <= height, `height should be in range [0..infinity]`);
    assert(0 <= x && x < width, `x should be in range [0..${width}]`);
    assert(0 <= y && y < height, `y should be in range [0..${height}]`);

    return {
        size: { width, height },
        holePos: { x, y, },
        cells: generator(width, height),
    };
}

export function moveHole(gameBoard: GameBoard, dir: Vector2d): GameBoard {
    const newHolePos = {
        x: gameBoard.holePos.x + dir.x,
        y: gameBoard.holePos.y + dir.y,
    };
    const { holePos, size, cells } = gameBoard;

    const a = cells[holePos.x][holePos.y];
    const b = cells[newHolePos.x][newHolePos.y];

    cells[holePos.x][holePos.y] = b;
    cells[newHolePos.x][newHolePos.y] = a;

    return {
        holePos: newHolePos,
        size,
        cells
    };
}

export const hardModeGeneratorx = randomGenerator;
export const normalModeGenerator = (width: number, height: number) => backwordsGenerator(width, height, 160);
export const easyModeGenerator = (width: number, height: number) => backwordsGenerator(width, height, 20);


function randomGenerator(width: number, height: number): number[][] {
    const maxAttempts = 1000;
    let attempt = 0;

    while (attempt < maxAttempts) {
        const values = range(0, width * height)
            .sort(Math.random);

        if (isSolvable(width, height, values)) {
            return _.chunk(values, width);
        }

        attempt++;
    }

    throw new Error(`something goes wrong, system can not generate solvable preset after ${maxAttempts} iterations`);
}

function backwordsGenerator(width: number, height: number, steps: number): number[][] {
    const cells = _(range(1, width * height)).concat(0).chunk(width).value();

    for (let step = 0; step < steps; step++) {

    }

    return cells;
}

// note: https://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html
export function isSolvable(gridWidth: number, gridHeight: number, gridValues: number[]): boolean {
    assert(2 <= gridWidth, `width should be in range [0..infinity]`);
    assert(2 <= gridHeight, `height should be in range [0..infinity]`);
    assert(gridValues && gridValues.length === gridWidth * gridHeight, `length of grid values should be [width x height]`);

    const holeRow = Math.floor(gridValues.indexOf(0) / gridWidth);
    assert(holeRow !== -1, `grid values should contains 0`);

    const holeRowFromBottom = gridHeight - holeRow;
    const totalInversions = _(gridValues).map(countInversions).sum();

    return gridWidth % 2 === 0
        ? holeRowFromBottom % 2 !== totalInversions % 2
        : totalInversions % 2 === 0;
}

function countInversions(gridValue: number, position: number, gridValues: number[]) {
    return _(gridValues)
        .slice(position + 1)
        .filter((value) => value > 0 && gridValue > value)
        .value()
        .length;
}
