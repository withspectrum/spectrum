import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from '../../../shared/Card';
import { Button } from '../../../shared/Globals';
import { Body, Title, Description } from './style';
import { login } from '../../../actions/user';

class LoginCard extends Component {
  login = e => {
    e.preventDefault();
    this.props.dispatch(login());
  };

  render() {
    return (
      <Card static overflow={'visible'}>
        <Body>
          <Description emoji>👋</Description>
          <Title>C'mon in, the chatter's fine</Title>
          <Description>
            Welcome to Spectrum, a community platform for the future. Sign in with Twitter to get started.
          </Description>
          <Button width={'100%'} onClick={this.login}>
            Sign in with Twitter
          </Button>
        </Body>
      </Card>
    );
  }
}

export default connect()(LoginCard);
