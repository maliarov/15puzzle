import React from 'react';

import { ScoreGamePlayState } from '../models/GamePlayEvents/Score';
import { GamePlayStatus, GamePlaySession } from '../models/GamePlaySession';

import { ScorePanel } from './ScorePanel';
import { HelpPanel } from './HelpPanel';
import { WinModal } from './WinModal';
import { Desk } from './Desk';

export interface MainViewState {
  gamePlaySession: GamePlaySession;
}

export function MainView({ state }: { state: MainViewState }) {
  return (
    <ScorePanel state={(state.gamePlaySession.state as ScoreGamePlayState)}>
      {(state.gamePlaySession.state.status === GamePlayStatus.plaing)
        ? <Desk gameBoard={state.gamePlaySession.state.gameBoard} />
        : <WinModal />
      }
      <HelpPanel />
    </ScorePanel>
  );
}
