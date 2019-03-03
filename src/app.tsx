import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';

import { Desk } from './components/Desk';

class App extends Component {
  render() {
    return <Desk />;
  }
}

// Creating our screen
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: '15 puzzle',
});

// Adding a way to quit the program
screen.key(['escape', 'q', 'C-c'], (ch, key) => process.exit(0));

// Rendering the React app using our screen
const component = render(<App />, screen);
