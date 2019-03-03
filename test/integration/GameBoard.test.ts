import {
  Vector2d,
} from '../../src/util/Vector';

import {
  Size2d,
} from '../../src/util/Size';

import {
  GameBoard,
  GameBordGenerator,

  init,
  moveEmptySpaceTo,
  canMoveEmptySpaceTo,
  getEmptySpaceMoveDirs,
} from '../../src/models/GameBoard';

(<{
  size: Size2d,
  generator: GameBordGenerator,
  expectations: {
    dir: Vector2d,
    values: number[],
  }[],
}[]>
  [
    { // top-left coner
      size: { width: 2, height: 2 },
      generator: () => [
        0, 1,
        2, 3,
      ],
      expectations: [
        { dir: { x: 1, y: 0 }, values: [1, 0, 2, 3] },
        { dir: { x: 0, y: 1 }, values: [2, 1, 0, 3] },
      ],
    },

    { // top-right coner
      size: { width: 2, height: 2 },
      generator: () => [
        1, 0,
        2, 3,
      ],
      expectations: [
        { dir: { x: -1, y: 0 }, values: [0, 1, 2, 3] },
        { dir: { x: 0, y: 1 }, values: [1, 3, 2, 0] },
      ],
    },

    { // bottom-right coner
      size: { width: 2, height: 2 },
      generator: () => [
        1, 2,
        3, 0,
      ],
      expectations: [
        { dir: { x: -1, y: 0 }, values: [1, 2, 0, 3] },
        { dir: { x: 0, y: -1 }, values: [1, 0, 3, 2] },
      ],
    },

    { // bottom-left coner
      size: { width: 2, height: 2 },
      generator: () => [
        1, 2,
        0, 3,
      ],
      expectations: [
        { dir: { x: 0, y: -1 }, values: [0, 2, 1, 3] },
        { dir: { x: 1, y: 0 }, values: [1, 2, 3, 0] },
      ],
    },

    { // left
      size: { width: 3, height: 3 },
      generator: () => [
        1, 2, 3,
        0, 4, 5,
        6, 7, 8,
      ],
      expectations: [
        { dir: { x: 0, y: -1 }, values: [0, 2, 3, 1, 4, 5, 6, 7, 8] },
        { dir: { x: 1, y: 0 }, values: [1, 2, 3, 4, 0, 5, 6, 7, 8] },
        { dir: { x: 0, y: 1 }, values: [1, 2, 3, 6, 4, 5, 0, 7, 8] },
      ],
    },

    { // top
      size: { width: 3, height: 3 },
      generator: () => [
        1, 0, 3,
        4, 2, 5,
        6, 7, 8,
      ],
      expectations: [
        { dir: { x: -1, y: 0 }, values: [0, 1, 3, 4, 2, 5, 6, 7, 8] },
        { dir: { x: 1, y: 0 }, values: [1, 3, 0, 4, 2, 5, 6, 7, 8] },
        { dir: { x: 0, y: 1 }, values: [1, 2, 3, 4, 0, 5, 6, 7, 8] },
      ],
    },

    { // right
      size: { width: 3, height: 3 },
      generator: () => [
        1, 2, 3,
        4, 5, 0,
        6, 7, 8,
      ],
      expectations: [
        { dir: { x: -1, y: 0 }, values: [1, 2, 3, 4, 0, 5, 6, 7, 8] },
        { dir: { x: 0, y: -1 }, values: [1, 2, 0, 4, 5, 3, 6, 7, 8] },
        { dir: { x: 0, y: 1 }, values: [1, 2, 3, 4, 5, 8, 6, 7, 0] },
      ],
    },

    { // bottom
      size: { width: 3, height: 3 },
      generator: () => [
        1, 2, 3,
        4, 7, 5,
        6, 0, 8,
      ],
      expectations: [
        { dir: { x: -1, y: 0 }, values: [1, 2, 3, 4, 7, 5, 0, 6, 8] },
        { dir: { x: 0, y: -1 }, values: [1, 2, 3, 4, 0, 5, 6, 7, 8] },
        { dir: { x: 1, y: 0 }, values: [1, 2, 3, 4, 7, 5, 6, 8, 0] },
      ],
    },

    { // center
      size: { width: 3, height: 3 },
      generator: () => [
        1, 2, 3,
        4, 0, 5,
        6, 7, 8,
      ],
      expectations: [
        { dir: { x: -1, y: 0 }, values: [1, 2, 3, 0, 4, 5, 6, 7, 8] },
        { dir: { x: 0, y: -1 }, values: [1, 0, 3, 4, 2, 5, 6, 7, 8] },
        { dir: { x: 1, y: 0 }, values: [1, 2, 3, 4, 5, 0, 6, 7, 8] },
        { dir: { x: 0, y: 1 }, values: [1, 2, 3, 4, 7, 5, 6, 0, 8] },
      ],
    },
  ]
).forEach(({ size, generator, expectations }) => {

  describe(`try move hole in [${generator(size)}]`, () => {
    let gameBoard: GameBoard;

    beforeAll(() => {
      gameBoard = init({ generator, size });
    });

    it('should return expected directions', () => {
      const dirs = expectations.map(({ dir }) => dir);

      expect(getEmptySpaceMoveDirs(gameBoard))
        .toMatchObject(dirs);
    });

    expectations.forEach(({ dir, values }) => {
      describe(`move hole in {x: ${dir.x}, y: ${dir.y}} direction`, () => {

        it('should be possible to move', () => {
          expect(canMoveEmptySpaceTo(gameBoard, dir)).toBeTruthy();
        });

        it('should return expected state after move', () => {
          expect(moveEmptySpaceTo(gameBoard, dir))
            .toMatchObject({
              size,
              values,
            });
        });

        it('should not mutate previous state after move', () => {
          expect(gameBoard)
            .toMatchObject({
              size,
              values: generator(size),
            });
        });

      });

    });
  });

});
