// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withCurrentUser } from 'src/components/withCurrentUser';
import AuthViewHandler from 'src/views/authViewHandler';

const Switch = props => {
  const { Component, FallbackComponent, ...rest } = props;
  return (
    <AuthViewHandler>
      {authed => {
        if (!authed) return <FallbackComponent {...rest} />;
        return <Component {...rest} />;
      }}
    </AuthViewHandler>
  );
};

// Connect that component to the Redux state
const ConnectedSwitch = compose(withCurrentUser)(Switch);

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
