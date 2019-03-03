import { chunk } from 'lodash';
import React from 'react';

import { GameBoard } from '../models/GameBoard';

export function Desk({ gameBoard }: { gameBoard: GameBoard }) {
    const cellHeight = 100.0 / gameBoard.size.height;
    const cellWidth = 100.0 / gameBoard.size.width;
    const cells = chunk(gameBoard.values, gameBoard.size.width);

    return (
        <box
            top="center"
            left="center"
            width="50%"
            height="50%"
            border={{ type: 'line' }}
            style={{ border: { fg: 'blue' } }}
        >
            {cells.map((row, rowIndex) =>
                <box
                    top={`${rowIndex * cellHeight}%`}
                    left="0%"
                    width="100%"
                    height={`${cellHeight}%`}
                >
                    {row.map((cell, cellIndex) =>
                        ((cell !== 0) && (
                            <box
                                top="0%"
                                left={`${cellIndex * cellWidth}%`}
                                width={`${cellWidth}%`}
                                height="100%"
                                align="center"
                                valign="middle"
                                content={cell.toString()}
                                border={{ type: 'line' }}
                                style={{ border: { fg: 'blue' } }}
                            />
                        )
                        ),
                    )}
                </box>,
            )}
        </box>
    );
}
