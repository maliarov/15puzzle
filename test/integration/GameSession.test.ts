import {
  init as initGamePlaySession,
  processActions as processGamePlaySessionActions,
  GamePlayStatus,
  GamePlaySession,
} from '../../src/models/GamePlaySession';

import { init as initGameBoard } from '../../src/models/GameBoard';
import { init as initMoveEmptySpaceGamePlayAction } from '../../src/models/GamePlayActions/MoveEmptySpace';
import { init as initSolvedGamePlayEvent } from '../../src/models/GamePlayEvents/Solved';
import {
  init as initScoreGamePlayEvent,
  ScoreGamePlayState,
} from '../../src/models/GamePlayEvents/Score';

describe('sunshine scenario', () => {

  describe('user makes few moves and win game', () => {
    let gameSession: GamePlaySession;

    beforeAll(async () => {
      const gameBoard = initGameBoard({
        size: { width: 3, height: 3 },
        generator: () => [
          1, 0, 3,
          4, 2, 6,
          7, 5, 8,
        ],
      });
      const gameScenario = [
        initScoreGamePlayEvent(),
        initSolvedGamePlayEvent(),
      ];

      gameSession = initGamePlaySession({ gameBoard, gameScenario });

      gameSession = await processGamePlaySessionActions(gameSession, [
        initMoveEmptySpaceGamePlayAction({ dir: { x: 0, y: 1 } }),
        initMoveEmptySpaceGamePlayAction({ dir: { x: 0, y: 1 } }),
        initMoveEmptySpaceGamePlayAction({ dir: { x: 1, y: 0 } }),
      ]);
    });

    it('should put game play session state to win status', () => {
      expect(gameSession.state.gameBoard.values).toMatchObject([
        1, 2, 3,
        4, 5, 6,
        7, 8, 0,
      ]);

      expect(gameSession.state.status).toBe(GamePlayStatus.win);
    });

    it('should put score game play session state to expected state', () => {
      const { Score: scoreState } =
        gameSession.state as ScoreGamePlayState;

      expect(scoreState).toMatchObject({
        rows: [true, true, true],
        value: 700,
      });
    });

  });

});
