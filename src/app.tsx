import commander from 'commander';

import React from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';

import { init as initMoveEmptySpaceGamePlayAction } from './models/GamePlayActions/MoveEmptySpace';
import { init as initSolvedGamePlayEvent } from './models/GamePlayEvents/Solved';
import { init as initScoreGamePlayEvent } from './models/GamePlayEvents/Score';
import { init as initGameBoard, easyModeGenerator, normalModeGenerator, hardModeGenerator } from './models/GameBoard';
import { init as initGamePlaySession, processAction as processGamePlaySessionAction } from './models/GamePlaySession';
import { MainView } from './components/MainView';

commander
  .version('1.0.0')
  .option('-s, --size <n>', 'Specify size of gameboard, by default is 4. Supported: 3, 4 and 5.', /^3|4|5$/, '4')
  .option('-r, --ragelevel [value]', 'Specify level of insane, by default is normal. Supported levels: easy, normal and hard.', /^easy|normal|hard$/i, 'normal')
  .parse(process.argv);

const viewState = {
  gamePlaySession: initGamePlaySession({
    gameBoard: getGameBoardFor({ ragelevel: commander.ragelevel, size: Number(commander.size) }),
    gameScenario: [
      initScoreGamePlayEvent(),
      initSolvedGamePlayEvent(),
    ],
  }),
};

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: `${Math.pow(Number(commander.size), 2) - 1} puzzle: [${commander.ragelevel}]`,
});

screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

screen.key(['left', 'up', 'right', 'down'], async (ch, key) => {
  const dirs: any = {
    left: { x: 1, y: 0 },
    up: { x: 0, y: 1 },
    right: { x: -1, y: 0 },
    down: { x: 0, y: -1 },
  };

  viewState.gamePlaySession = await processGamePlaySessionAction(
    viewState.gamePlaySession,
    initMoveEmptySpaceGamePlayAction({ dir: dirs[key.name] }),
  );

  render(<MainView state={viewState} />, screen);
});

render(<MainView state={viewState} />, screen);

function getGameBoardFor({ ragelevel, size }: { ragelevel: string, size: number }) {
  const gameBoardSize = { width: size, height: size };
  switch (ragelevel) {
    case 'easy': return initGameBoard({ size: gameBoardSize, generator: easyModeGenerator });
    case 'normal': return initGameBoard({ size: gameBoardSize, generator: normalModeGenerator });
    case 'hard': return initGameBoard({ size: gameBoardSize, generator: hardModeGenerator });
    default:
      return initGameBoard();
  }
}
