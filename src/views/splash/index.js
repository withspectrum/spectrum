import React, { Component } from 'react';
import { track } from '../../helpers/events';
import { storeItem, getItemFromStorage } from '../../helpers/localStorage';
import {
  Overview,
  Centralized,
  CommunitySearch,
  Chat,
  Sell,
  Yours,
  PageFooter,
} from './view';
import { Wrapper } from './style';

class Splash extends Component {
  state: {
    preferredSigninMethod: string,
  };

  constructor() {
    super();

    const preferredSigninMethod = getItemFromStorage('preferred_signin_method');

    this.state = {
      preferredSigninMethod,
    };
  }

  componentDidMount() {
    track('homepage', 'viewed', null);
  }

  trackSignin = (type, method) => {
    track('homepage', 'logged in', type);
    storeItem('preferred_signin_method', method);
  };

  render() {
    return (
      <Wrapper data-e2e-id="splash-page">
        <Overview />
        <Centralized />
        <CommunitySearch />
        <Chat />
        <Sell />
        <Yours />
        <PageFooter />
      </Wrapper>
    );
  }
}
export default Splash;
