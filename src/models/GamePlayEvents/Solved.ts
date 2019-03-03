import { GamePlayEvent } from '../GamePlayEvent';
import { GamePlayAction } from '../GamePlayAction';
import { GamePlayState, GamePlayStatus } from '../GamePlaySession';
import { isSolved } from '../GameBoard';
import { init as initChangeStatusGamePlayAction } from '../GamePlayActions/ChangeStatus';

export function init(): GamePlayEvent {
  return {
    init,
    apply,
  };

  function init(state: GamePlayState): GamePlayState {
    return state;
  }

  function apply(state: GamePlayState): GamePlayAction[] | null {
    return isSolved(state.gameBoard)
      ? [initChangeStatusGamePlayAction({ prevStatus: state.status, nextStatus: GamePlayStatus.win })]
      : null;
  }
}
