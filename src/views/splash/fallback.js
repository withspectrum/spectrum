// @flow
// Fallback to the <Splash /> component if there's no current user
import React from 'react';
import { connect } from 'react-redux';
import Splash from './';

// This is the component that determines at render time what to do
const SplashFallbackComp = props => {
  const { Component, currentUser, ...rest } = props;
  if (!currentUser || !Component) return <Splash {...rest} />;
  return <Component {...rest} />;
};

// Connect that component to the Redux state
const ConnectedFallbackComp = connect(state => ({
  currentUser: state.users.currentUser,
}))(SplashFallbackComp);

const splashFallback = Component => {
  return props => <ConnectedFallbackComp {...props} Component={Component} />;
};

export default splashFallback;
