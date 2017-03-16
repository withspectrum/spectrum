import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LoginWrapper, LoginText, LoginButton } from './style';
import { login } from '../../../../actions/user';

class LoginCard extends Component {
  login = e => {
    e.preventDefault();
    this.props.dispatch(login());
  };

  render() {
    return (
      <LoginWrapper onClick={this.login}>
        <LoginText>Sign in to join the conversation.</LoginText>
        <LoginButton>Sign in with Twitter</LoginButton>
      </LoginWrapper>
    );
  }
}

export default connect()(LoginCard);
