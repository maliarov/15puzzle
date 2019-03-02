import { init, moveHole, isSolvable } from '../../src/models/GameBoard';

(<[number, number, number[], boolean][]>[
    [4, 4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0], true],
    [4, 4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14, 0], false],
]).forEach(([width, height, values, expectation]) => {
    test(`solvability of ${values} should be ${expectation}`, () => {
        expect(isSolvable(width, height, values)).toBe(expectation);
    });
});


test('moveHole', () => {
    const generator = () => [[1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], [4, 8, 12, 0]];

    const gameBoard = init({ generator });

    expect(gameBoard).toMatchObject({
        size: { width: 4, height: 4 },
        holePos: { x: 3, y: 3 },
        cells: [[1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], [4, 8, 12, 0]]
    });

    const newGameBoard = moveHole(gameBoard, { x: 0, y: -1 });

    expect(newGameBoard.cells).toMatchObject([[1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], [4, 8, 0, 12]]);
});
