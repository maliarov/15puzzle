import { range, chunk } from 'lodash';

import { GamePlayEvent } from '../GamePlayEvent';
import { GamePlayState } from '../GamePlaySession';
import { GamePlayAction } from '../GamePlayAction';

import { init as initRowBonusScoreGamePlayActions } from '../GamePlayActions/RowBonusScore';
import { init as initBordBonusScoreGamePlayActions } from '../GamePlayActions/BordBonusScore';
import { isSolved } from '../GameBoard';

export interface ScoreGamePlayState extends GamePlayState {
  Score: {
    rows: boolean[];
    value: number;
  };
}

export function init(): GamePlayEvent {
  return {
    init,
    apply,
  };

  function init(state: GamePlayState): GamePlayState {
    // note: go through each row and check if it is already formed in right order
    const cells = chunk(state.gameBoard.values, state.gameBoard.size.width);
    const rows = cells.map((row, rowIndex) =>
      row.every((value, index) =>
        value === rowIndex * state.gameBoard.size.width + index + 1 ||
        (value === 0 && rowIndex === state.gameBoard.size.height - 1 && index === state.gameBoard.size.width - 1),
      ),
    );

    return {
      ...state,
      Score: {
        rows,
        value: 0,
      },
    } as ScoreGamePlayState;
  }

  function apply(state: GamePlayState): GamePlayAction[] | null {
    const { Score: scoreState } = state as ScoreGamePlayState;

    if (scoreState.rows.every(row => row)) {
      return null;
    }

    const cells = chunk(state.gameBoard.values, state.gameBoard.size.width);
    const row = cells.findIndex((row, rowIndex) =>
      !scoreState.rows[rowIndex] && row.every((value, index) =>
        value === rowIndex * state.gameBoard.size.width + index + 1 ||
        (value === 0 && rowIndex === state.gameBoard.size.height - 1 && index === state.gameBoard.size.width - 1),
      ),
    );

    return (row !== -1) && [
      initRowBonusScoreGamePlayActions({ row }),
      ...(isSolved(state.gameBoard) && [initBordBonusScoreGamePlayActions()] || []),
    ] || null;
  }
}
