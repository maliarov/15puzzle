import { chunk } from 'lodash';
import React from 'react';

import { GameBoard } from '../models/GameBoard';

export function Desk({ gameBoard }: { gameBoard: GameBoard }) {
  const cellHeight = 100 / gameBoard.size.height;
  const cellWidth = 100 / gameBoard.size.width;
  const cells = chunk(gameBoard.values, gameBoard.size.width);

  return (
    <box
      top="center"
      left="center"
      width="50%"
      height="50%"
    >
      {cells.map((row, rowIndex) =>
        row.map((cell, cellIndex) =>
          ((cell !== 0) && (
            <box
              key={`${rowIndex}-${cellIndex}`}
              top={`${rowIndex * cellHeight}%`}
              left={`${cellIndex * cellWidth}%`}
              width={`${cellWidth}%`}
              height={`${cellHeight}%`}
              align="center"
              valign="middle"
              content={cell.toString()}
              border={{ type: 'line' }}
            />
          )),
        ),
      )}
    </box>
  );
}
