import { GamePlayState } from './GamePlaySession';
import { GamePlayAction } from './GamePlayAction';

export interface GamePlayEvent {
  init: (state: GamePlayState) => GamePlayState;
  apply: (state: GamePlayState) => GamePlayAction[] | null;
}
