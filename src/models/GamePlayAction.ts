import { GamePlayState } from './GamePlaySession';

export interface GamePlayAction {
  name: string;
  apply: (state: GamePlayState) => GamePlayState | null;
  revert: (state: GamePlayState) => GamePlayState;
}
