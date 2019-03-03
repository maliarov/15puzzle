import {
  Vector2d,
  invertVec2d,
} from '../util/Vector';

import {
  GameAction,
} from './GameAction';

import {
  moveEmptyPlaceTo,
} from './GameBoard';

import {
  GameState,
} from './GameSession';

export function init(dir: Vector2d): GameAction {
  return {
    apply,
    revert,
  };

  function apply(state: GameState): GameState {
    return {
      ...state,
      gameBoard: moveEmptyPlaceTo(state.gameBoard, dir),
    };
  }

  function revert(state: GameState): GameState {
    return {
      ...state,
      gameBoard: moveEmptyPlaceTo(state.gameBoard, invertVec2d(dir)),
    };
  }
}
