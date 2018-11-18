// @flow
import React from 'react';
import compose from 'recompose/compose';
import { getCurrentUser } from 'shared/graphql/queries/user/getUser';
import AuthViewHandler from 'src/views/authViewHandler';

const Switch = props => {
  const { Component, FallbackComponent, ...rest } = props;
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
const ConnectedSwitch = compose(getCurrentUser)(Switch);

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
