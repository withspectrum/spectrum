import React from 'react';
import { connect } from 'react-redux';
import { Twitter } from '../shared/Icons';
import {
  Background,
  Tagline,
  Button,
  LogoWhite,
  ContentWrapper,
} from './style';
import { login } from '../actions/user';

class Homepage extends React.Component {
  login = e => {
    e.preventDefault();
    this.props.dispatch(login());
  };

  render() {
    return (
      <Background>
        <ContentWrapper>
          <LogoWhite />
          <Tagline>It's like a forum, but for Mars colonists.</Tagline>
          <Button onClick={this.login}>
            <Twitter color={'brand'} stayActive />
            {' '}
            <span>Sign in with Twitter</span>
          </Button>
        </ContentWrapper>
      </Background>
    );
  }
}

export default connect()(Homepage);
