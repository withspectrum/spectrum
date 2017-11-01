import React from 'react';
import Composer from '../../components/composer';
import Titlebar from '../titlebar';
import { View } from './style';
import querystring from 'querystring';

const Compose = props => {
  const { slug, isOnboarding } = querystring.parse(
    props.location.search.slice(1)
  );

  return <Composer activeCommunity={slug} isOnboarding={isOnboarding} />;
};

export default Compose;
