import {
  init as initGamePlaySession,
  processActions as processGamePlaySessionActions,
  GamePlayStatus,
} from '../../src/models/GamePlaySession';

import { init as initGameBoard } from '../../src/models/GameBoard';
import { init as initMoveEmptySpaceGamePlayAction } from '../../src/models/GamePlayActions/MoveEmptySpace';
import { init as initSolvedGamePlayEvent } from '../../src/models/GamePlayEvents/Solved';
import {
  init as initScoreGamePlayEvent,
  ScoreGamePlayState,
} from '../../src/models/GamePlayEvents/Score';

describe('sunshine scenarios', () => {

  describe('user makes few moves and win game', () => {
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
    const gameSession = initGamePlaySession({ gameBoard, gameScenario });

    it('should put game play session to win status', async () => {
      const newGameSession = await processGamePlaySessionActions(gameSession, [
        initMoveEmptySpaceGamePlayAction({ dir: { x: 0, y: 1 } }),
        initMoveEmptySpaceGamePlayAction({ dir: { x: 0, y: 1 } }),
        initMoveEmptySpaceGamePlayAction({ dir: { x: 1, y: 0 } }),
      ]);

      expect(newGameSession.state.gameBoard.values).toMatchObject([
        1, 2, 3,
        4, 5, 6,
        7, 8, 0,
      ]);

      expect(newGameSession.state.status).toBe(GamePlayStatus.win);

      const { Score: scoreState } =
        newGameSession.state as ScoreGamePlayState;

      expect(scoreState).toMatchObject({
        rows: [true, true, true],
        value: 700,
      });

      console.log(newGameSession.history.actions);

    });

  });

});
