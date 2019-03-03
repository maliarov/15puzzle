import {
  GameAction,
} from './GameAction';

import {
  GameBoard,
} from './GameBoard';

import {
  Gamer,
} from './Gamer';

export interface GameSession {
  state: GameState;
  history: {
    initialState: GameState,
    actions: GameAction[],
  };
}

export interface GameState {
  gamer: Gamer;
  gameBoard: GameBoard;
}

export function init({ gamer, gameBoard }: {
  gamer: Gamer,
  gameBoard: GameBoard,
}): GameSession {
  const state = {
    gamer,
    gameBoard,
  };

  return {
    state,
    history: {
      initialState: state,
      actions: [],
    },
  };
}

export function process(session: GameSession, actions?: GameAction[]): GameSession {
  const state = (actions || []).reduce((state, action) => action.apply(state), session.state);

  const updatedSession: GameSession = {
    state,
    history: {
      initialState: session.history.initialState,
      actions: [
        ...session.history.actions,
        ...(actions || []),
      ],
    },
  };

  return updatedSession;
}
