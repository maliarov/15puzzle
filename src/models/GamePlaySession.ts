import { GameBoard } from './GameBoard';
import { GamePlayEvent } from './GameplayEvent';
import { GamePlayAction } from './GamePlayAction';

export interface GamePlaySession {
  state: GamePlayState;
  scenario: GamePlayEvent[];
  history: {
    initialState: GamePlayState,
    actions: GamePlayAction[],
  };
}

export enum GamePlayStatus {
  plaing,
  win,
  loose,
}

export interface GamePlayState {
  status: GamePlayStatus;
  gameBoard: GameBoard;
}

export function init({ gameBoard, gameScenario }: {
  gameBoard: GameBoard, gameScenario: GamePlayEvent[],
}): GamePlaySession {
  const state = (gameScenario || [])
    .reduce(
      (state, event) => event.init(state),
      { gameBoard, status: GamePlayStatus.plaing },
    );

  return {
    state,
    scenario: gameScenario,
    history: {
      initialState: state,
      actions: [],
    },
  };
}

export async function processActions(session: GamePlaySession, actions: GamePlayAction[]): Promise<GamePlaySession> {
  let currentSession = session;

  for (const action of actions) {
    currentSession = await processAction(currentSession, action);
  }

  return currentSession;
}

export async function processAction(session: GamePlaySession, action: GamePlayAction): Promise<GamePlaySession> {
  const state = action.apply(session.state);
  if (!state) {
    return session;
  }

  let currentSession = session;

  currentSession = updateState(currentSession, state);
  currentSession = logAction(currentSession, action);

  for (const gameEvent of session.scenario) {
    const eventActions = gameEvent.apply(state!);
    if (!eventActions) {
      continue;
    }

    currentSession = await processActions(currentSession, eventActions);
  }

  return currentSession;
}

function logAction(session: GamePlaySession, action: GamePlayAction): GamePlaySession {
  return {
    ...session,
    history: {
      ...session.history,
      actions: [
        ...session.history.actions,
        action,
      ],
    },
  };
}

function updateState(session: GamePlaySession, state: GamePlayState): GamePlaySession {
  return {
    ...session,
    state,
  };
}
