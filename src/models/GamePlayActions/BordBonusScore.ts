import { GamePlayState } from '../GamePlaySession';
import { GamePlayAction } from '../GamePlayAction';
import { ScoreGamePlayState } from '../GamePlayEvents/Score';

const name = 'BordBonusScore';

export function init(): GamePlayAction {
  return {
    name,
    apply,
    revert,
  };

  function apply(state: GamePlayState): GamePlayState | null {
    const scoreState = state as ScoreGamePlayState;

    return {
      ...scoreState,
      Score: {
        ...scoreState.Score,
        value: scoreState.Score.value + 400,
      },
    } as ScoreGamePlayState;
  }

  function revert(state: GamePlayState): GamePlayState {
    const scoreState = state as ScoreGamePlayState;

    return {
      ...scoreState,
      Score: {
        ...scoreState.Score,
        value: scoreState.Score.value - 400,
      },
    } as ScoreGamePlayState;
  }
}
