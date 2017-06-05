import React, { Component } from 'react';
import { Body, Navbar, Logo } from './style';
import Overview from './components/overview';

class App extends Component {
  render() {
    return (
      <Body>
        <Navbar>
          <Logo>Spectrum Admin</Logo>
        </Navbar>

        <Overview />
      </Body>
    );
  }
}

export default App;
