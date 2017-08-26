// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { track } from '../../helpers/events';
import Column from '../../components/column';
import Icon from '../../components/icons';
import Search from '../explore/components/search';
import { FlexCol, FlexRow } from '../../components/globals';
import { SERVER_URL } from '../../api';
import { storeItem, getItemFromStorage } from '../../helpers/localStorage';
import {
  Overview,
  Centralized,
  CommunitySearch,
  Chat,
  Sell,
  Yours,
  PageFooter,
} from './sections';
import { Conversation, Discover } from './components/illustrations';
import {
  Wrapper,
  Tagline,
  Copy,
  Bullets,
  Bullet,
  BulletHeading,
  BulletTitle,
  BulletCopy,
  LogoContainer,
  LogoWhite,
  SectionContent,
  LinkBlock,
  LoginCard,
  Flexer,
  PrimaryCTA,
  SecondaryCTA,
} from './style';

class Homepage extends Component {
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
    const { preferredSigninMethod } = this.state;

    return (
      <Wrapper>
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
export default Homepage;
