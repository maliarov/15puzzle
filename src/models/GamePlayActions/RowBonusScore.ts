import { GamePlayState } from '../GamePlaySession';
import { GamePlayAction } from '../GamePlayAction';
import { ScoreGamePlayState } from '../GamePlayEvents/Score';

const name = 'RowBonusScore';

export function init({ row }: { row: number }): GamePlayAction {
  return {
    name,
    apply,
    revert,
  };

  function apply(state: GamePlayState): GamePlayState | null {
    const scoreState = state as ScoreGamePlayState;

    if (scoreState.Score.rows[row]) {
      return null;
    }

    const rows = [...scoreState.Score.rows];

    return {
      ...scoreState,
      Score: {
        rows: (rows[row] = true, rows),
        value: scoreState.Score.value + 100,
      },
    } as ScoreGamePlayState;
  }

  function revert(state: GamePlayState): GamePlayState {
    const scoreState = state as ScoreGamePlayState;
    const rows = [...scoreState.Score.rows];

    return {
      ...scoreState,
      Score: {
        rows: (rows[row] = false, rows),
        value: scoreState.Score.value - 100,
      },
    } as ScoreGamePlayState;
  }
}
