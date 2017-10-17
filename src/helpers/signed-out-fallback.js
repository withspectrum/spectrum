// Render a component depending on a users authentication status
import React from 'react';
import { connect } from 'react-redux';

// This is the component that determines at render time what to do
const Switch = props => {
  const { Component, FallbackComponent, currentUser, ...rest } = props;

  if (!currentUser || !Component) {
    return <FallbackComponent {...rest} />;
  } else {
    return <Component {...rest} />;
  }
};

// Connect that component to the Redux state
const ConnectedSwitch = connect(state => ({
  currentUser: state.users.currentUser,
}))(Switch);

const signedOutFallback = (Component, FallbackComponent) => {
  return props => (
    <ConnectedSwitch
      {...props}
      FallbackComponent={FallbackComponent}
      Component={Component}
    />
  );
};

export default signedOutFallback;
