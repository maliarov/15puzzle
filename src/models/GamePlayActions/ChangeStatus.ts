import { GamePlayAction } from '../GamePlayAction';
import { GamePlayState, GamePlayStatus } from '../GamePlaySession';

const name = 'ChangeStatus';

export function init({ prevStatus, nextStatus }: {
  prevStatus: GamePlayStatus, nextStatus: GamePlayStatus,
}): GamePlayAction {
  return {
    name,
    apply,
    revert,
  };

  function apply(state: GamePlayState): GamePlayState | null {
    if (state.status === nextStatus) {
      return null;
    }

    return {
      ...state,
      status: nextStatus,
    };
  }

  function revert(state: GamePlayState): GamePlayState {
    return {
      ...state,
      status: prevStatus,
    };
  }
}
