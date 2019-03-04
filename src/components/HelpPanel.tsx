import React from 'react';

export function HelpPanel() {
  return (
    <box
      bottom="0" left="0"
      width="100%-2" height="130"
      border={{ type: 'line' }}
      style={{ border: { fg: 'blue' } }}
      label=" &#9432; Help "
    >
      Dear Player, please, use &#8678; &#8679; &#8680; and &#8681; arrow keys to move puzzle elements across game field
      until You build the perfect ordered set with empty slot in bottom right corner.

      You will get 100 additional points for each assembled line and 400 for whole field.

      Use Ctrl-C, Esc or Q keys to exit game.
    </box>
  );
}
