// @flow
// Render a component depending on a users authentication status
import React from 'react';
import { connect } from 'react-redux';
import AuthViewHandler from 'src/views/authViewHandler';

// This is the component that determines at render time what to do
const Switch = props => {
  const { Component, FallbackComponent, currentUser, ...rest } = props;
  return (
    <AuthViewHandler>
      {authed => {
        if (!authed) {
          return <FallbackComponent {...rest} />;
        } else {
          return <Component {...rest} />;
        }
      }}
    </AuthViewHandler>
  );
};

// Connect that component to the Redux state
const ConnectedSwitch = connect(
  (state: *): * => ({
    currentUser: state.users.currentUser,
  })
)(Switch);

const signedOutFallback = (
  Component: React$ComponentType<*>,
  FallbackComponent: React$ComponentType<*>
) => {
  return (props: *) => (
    <ConnectedSwitch
      {...props}
      FallbackComponent={FallbackComponent}
      Component={Component}
    />
  );
};

export default signedOutFallback;
