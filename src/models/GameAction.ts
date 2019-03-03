import {
  GameState,
} from './GameSession';

export interface GameAction {
  apply: (state: GameState) => GameState;
  revert: (state: GameState) => GameState;
}
