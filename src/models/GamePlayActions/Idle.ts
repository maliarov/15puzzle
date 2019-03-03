import { GamePlayState } from '../GamePlaySession';
import { GamePlayAction } from '../GamePlayAction';

const name = 'Idle';

export function init(): GamePlayAction {
  return {
    name,
    apply,
    revert,
  };

  function apply(state: GamePlayState): GamePlayState | null {
    return null;
  }

  function revert(state: GamePlayState): GamePlayState {
    return state;
  }
}
