import React from 'react';

export function WinModal() {
  return (
    <box
      left="center"
      top="center"
      width="30%"
      height="20%"
      align="center"
      valign="middle"
      label=" Congratulations "
      content="You've won!"
      border={{ type: 'line' }}
      style={{ border: { fg: 'white' } }}
    >
    </box>
  );
}
