import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { NavBarContainer, Logo } from './style';

class NavBar extends Component {
  render() {
    return (
      <NavBarContainer>
        <Link to="/">
          <Logo src="/img/mark-white.png" role="presentation" />
        </Link>
      </NavBarContainer>
    );
  }
}

export const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(NavBar);
