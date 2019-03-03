import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';

import { Desk } from './components/Desk';

import { init as initSolvedGamePlayEvent } from './models/GamePlayEvents/Solved';
import { init as initScoreGamePlayEvent } from './models/GamePlayEvents/Score';
import { init as initGameBoard } from './models/GameBoard';
import { init as initGamePlaySession, processAction as processGamePlaySessionAction } from './models/GamePlaySession';
import { init as initMoveEmptySpaceGamePlayAction } from './models/GamePlayActions/MoveEmptySpace';

const gameScenario = [
  initScoreGamePlayEvent(),
  initSolvedGamePlayEvent(),
];
const gameBoard = initGameBoard();
const gamePlaySession = initGamePlaySession({ gameBoard, gameScenario });

const state = {
  gamePlaySession,
};

const dirs: any = {
  left: { x: 1, y: 0 },
  up: { x: 0, y: 1 },
  right: { x: -1, y: 0 },
  down: { x: 0, y: -1 },
};

class App extends Component {
  render() {
    return <Desk gameBoard={state.gamePlaySession.state.gameBoard} />;
  }
}

// Creating our screen
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: '15 puzzle',
});

screen.key(['left', 'up', 'right', 'down'], async (ch, key) => {
  state.gamePlaySession = await processGamePlaySessionAction(
    state.gamePlaySession,
    initMoveEmptySpaceGamePlayAction({ dir: dirs[key.name] }),
  );
  render(<App />, screen);
});

screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

render(<App />, screen);
