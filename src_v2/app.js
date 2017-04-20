import React, { Component } from 'react';

class App extends Component {
  render() {
    const { children } = this.props;

    return (
      <Body>
        <Navbar />

        {children}

      </Body>
    );
  }
}

export default App;
