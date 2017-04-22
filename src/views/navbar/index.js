import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Nav, Spacer } from './style';

class Navbar extends Component {
  logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  render() {
    return (
      <Container>
        <Nav>
          <Link to="/">Logo</Link>
          <Link to="/">Home</Link>
          <Link to="/messages">Messages</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/notifications">Notifications</Link>
          <Link to="/story">Story</Link>
          <Link to="/users/me">Me</Link>
          <a onClick={this.logout}>logout</a>
        </Nav>

        {/*
          Spacer is used to globally push all app elements below the fixed
          position nav
        */}
        <Spacer />
      </Container>
    );
  }
}

export default Navbar;
