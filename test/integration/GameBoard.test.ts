import {
  Size,

  init,

  moveHoleTo,
  canMoveHoleTo,
  getHoleMoveDirs,
} from '../../src/models/GameBoard';

(<[Size, (size: Size) => number[], any[]][]>[

  [ // top-left coner
    { width: 2, height: 2 },
    () => [
      0, 1,
      2, 3,
    ],
    [
      { dir: { x: 1, y: 0 }, values: [1, 0, 2, 3] },
      { dir: { x: 0, y: 1 }, values: [2, 1, 0, 3] },
    ],
  ],

  [ // top-right coner
    { width: 2, height: 2 },
    () => [
      1, 0,
      2, 3,
    ],
    [
      { dir: { x: -1, y: 0 }, values: [0, 1, 2, 3] },
      { dir: { x: 0, y: 1 }, values: [1, 3, 2, 0] },
    ],
  ],

  [ // bottom-right coner
    { width: 2, height: 2 },
    () => [
      1, 2,
      3, 0,
    ],
    [
      { dir: { x: -1, y: 0 }, values: [1, 2, 0, 3] },
      { dir: { x: 0, y: -1 }, values: [1, 0, 3, 2] },
    ],
  ],

  [ // bottom-left coner
    { width: 2, height: 2 },
    () => [
      1, 2,
      0, 3,
    ],
    [
      { dir: { x: 0, y: -1 }, values: [0, 2, 1, 3] },
      { dir: { x: 1, y: 0 }, values: [1, 2, 3, 0] },
    ],
  ],

  [ // left
    { width: 3, height: 3 },
    () => [
      1, 2, 3,
      0, 4, 5,
      6, 7, 8,
    ],
    [
      { dir: { x: 0, y: -1 }, values: [0, 2, 3, 1, 4, 5, 6, 7, 8] },
      { dir: { x: 1, y: 0 }, values: [1, 2, 3, 4, 0, 5, 6, 7, 8] },
      { dir: { x: 0, y: 1 }, values: [1, 2, 3, 6, 4, 5, 0, 7, 8] },
    ],
  ],

  [ // top
    { width: 3, height: 3 },
    () => [
      1, 0, 3,
      4, 2, 5,
      6, 7, 8,
    ],
    [
      { dir: { x: -1, y: 0 }, values: [0, 1, 3, 4, 2, 5, 6, 7, 8] },
      { dir: { x: 1, y: 0 }, values: [1, 3, 0, 4, 2, 5, 6, 7, 8] },
      { dir: { x: 0, y: 1 }, values: [1, 2, 3, 4, 0, 5, 6, 7, 8] },
    ],
  ],

  [ // right
    { width: 3, height: 3 },
    () => [
      1, 2, 3,
      4, 5, 0,
      6, 7, 8,
    ],
    [
      { dir: { x: -1, y: 0 }, values: [1, 2, 3, 4, 0, 5, 6, 7, 8] },
      { dir: { x: 0, y: -1 }, values: [1, 2, 0, 4, 5, 3, 6, 7, 8] },
      { dir: { x: 0, y: 1 }, values: [1, 2, 3, 4, 5, 8, 6, 7, 0] },
    ],
  ],

  [ // bottom
    { width: 3, height: 3 },
    () => [
      1, 2, 3,
      4, 7, 5,
      6, 0, 8,
    ],
    [
      { dir: { x: -1, y: 0 }, values: [1, 2, 3, 4, 7, 5, 0, 6, 8] },
      { dir: { x: 0, y: -1 }, values: [1, 2, 3, 4, 0, 5, 6, 7, 8] },
      { dir: { x: 1, y: 0 }, values: [1, 2, 3, 4, 7, 5, 6, 8, 0] },
    ],
  ],

  [ // center
    { width: 3, height: 3 },
    () => [
      1, 2, 3,
      4, 0, 5,
      6, 7, 8,
    ],
    [
      { dir: { x: -1, y: 0 }, values: [1, 2, 3, 0, 4, 5, 6, 7, 8] },
      { dir: { x: 0, y: -1 }, values: [1, 0, 3, 4, 2, 5, 6, 7, 8] },
      { dir: { x: 1, y: 0 }, values: [1, 2, 3, 4, 5, 0, 6, 7, 8] },
      { dir: { x: 0, y: 1 }, values: [1, 2, 3, 4, 7, 5, 6, 0, 8] },
    ],
  ],

]).forEach(([size, generator, expectations]) => {

  describe(`try move hole in [${generator(size)}]`, () => {
    const gameBoard = init({ generator, size });

    it('should return expected directions', () => {
      expect(getHoleMoveDirs(gameBoard))
        .toMatchObject(expectations.map(({ dir }) => dir));
    });

    expectations.forEach(({ dir, values }) => {
      describe(`move hole in {x: ${dir.x}, y: ${dir.y}} direction`, () => {

        it('should be possible to move', () => {
          expect(canMoveHoleTo(gameBoard, dir)).toBeTruthy();
        });

        it('should return expected state after move', () => {
          expect(moveHoleTo(gameBoard, dir))
            .toMatchObject({
              size,
              values,
            });
        });
      });

    });
  });

});
