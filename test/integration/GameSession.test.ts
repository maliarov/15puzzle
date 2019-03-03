import {
  init as initGameBoard,
} from '../../src/models/GameBoard';

import {
  init as initGameSession,
  process as processGameSession,
} from '../../src/models/GameSession';

import {
  init as initMoveEmptySpaceGameAction,
} from '../../src/models/MoveEmptyPlaceGameAction';

describe('sunshine scenarios', () => {

  describe('user makes few moves and win game', () => {

    const gamer = { score: 0 };
    const gameBoard = initGameBoard({
      size: { width: 3, height: 3 },
      generator: () => [
        1, 2, 3,
        4, 0, 6,
        7, 5, 8,
      ],
    });
    const gameSession = initGameSession({ gamer, gameBoard });

    it('test', () => {
      const newGameSession = processGameSession(gameSession, [
        initMoveEmptySpaceGameAction({ x: 0, y: 1 }),
        initMoveEmptySpaceGameAction({ x: 1, y: 0 }),
      ]);

      expect(newGameSession.state.gameBoard.values).toMatchObject([
        1, 2, 3,
        4, 5, 6,
        7, 8, 0,
      ]);
    });

  });

});
