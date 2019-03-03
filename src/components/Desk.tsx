import { chunk } from 'lodash';
import React from 'react';

import { init } from '../models/GameBoard';

const gameboard = init();

const cellHeight = 100.0 / gameboard.size.height;
const cellWidth = 100.0 / gameboard.size.width;

const cells = chunk(gameboard.values, gameboard.size.width);

export const Desk = () => (
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
                    <box
                        top="0%"
                        left={`${cellIndex * cellWidth}%`}
                        width={`${cellWidth}%`}
                        height="100%"
                        border={{ type: 'line' }}
                        style={{ border: { fg: 'blue' } }}
                    >
                        {`${rowIndex}-${cell}`}
                    </box>,
                )}
            </box>,
        )}
    </box>
);
