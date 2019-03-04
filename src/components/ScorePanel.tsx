import React from 'react';

import { ScoreGamePlayState } from '../models/GamePlayEvents/Score';

export function ScorePanel({ state: { Score }, children }: {
  state: ScoreGamePlayState, children: React.ReactElement | React.ReactElement[],
}) {
  return (
    <box
      top="0" left="0"
      width="100%" height="100%"
      align="center" valign="middle"
      border={{ type: 'line' }}
      style={{ border: { fg: 'blue' } }}
      label={` ♔ Score: ${Score.value} pts.`}
    >
      {children}
    </box>
  );
}
