import {
  Vector2d,
  invertVec2d,
} from '../../util/Vector';

import { GamePlayAction } from '../GamePlayAction';
import { GamePlayState, GamePlayStatus } from '../GamePlaySession';
import { moveEmptySpaceTo, canMoveEmptySpaceTo } from '../GameBoard';

const name = 'MoveEmptySpace';

export function init({ dir }: { dir: Vector2d }): GamePlayAction {
  return {
    name,
    apply,
    revert,
  };

  function apply(state: GamePlayState): GamePlayState | null {
    if (state.status !== GamePlayStatus.plaing) {
      return null;
    }
    if (!canMoveEmptySpaceTo(state.gameBoard, dir)) {
      return null;
    }

    return {
      ...state,
      gameBoard: moveEmptySpaceTo(state.gameBoard, dir),
    };
  }

  function revert(state: GamePlayState): GamePlayState {
    return {
      ...state,
      gameBoard: moveEmptySpaceTo(state.gameBoard, invertVec2d(dir)),
    };
  }
}
