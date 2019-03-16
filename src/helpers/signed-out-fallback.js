// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withCurrentUser } from 'src/components/withCurrentUser';
import AuthViewHandler from 'src/views/authViewHandler';

const Switch = props => {
  const { Component, FallbackComponent, searchParamException, ...rest } = props;
  let isException = false;

  if (searchParamException) {
    const searchParamsString = (props.location && props.location.search) || '';
    const searchParams = new Map(
      searchParamsString
        .substring(1)
        .split('&')
        .map(kv => kv.split('='))
    );

    isException =
      searchParams.has(searchParamException) &&
      searchParams.get(searchParamException) !== 'false';
  }

  return (
    <AuthViewHandler>
      {authed => {
        if (!authed || isException) {
          return <FallbackComponent {...rest} />;
        } else {
          return <Component {...rest} />;
        }
      }}
    </AuthViewHandler>
  );
};

// Connect that component to the Redux state
const ConnectedSwitch = compose(withCurrentUser)(Switch);

const signedOutFallback = (
  Component: React$ComponentType<*>,
  FallbackComponent: React$ComponentType<*>,
  searchParamException: string = null
) => {
  return (props: *) => (
    <ConnectedSwitch
      {...props}
      FallbackComponent={FallbackComponent}
      Component={Component}
      searchParamException={searchParamException}
    />
  );
};

export default signedOutFallback;
