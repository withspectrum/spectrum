// @flow
// Render a component depending on a users authentication status
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import queryString from 'query-string';
import { getCurrentUser } from 'shared/graphql/queries/user/getUser';
import { Loading } from 'src/components/loading';

// This is the component that determines at render time what to do
const Switch = props => {
  const { Component, FallbackComponent, currentUser, ...rest } = props;
  const { authed } = queryString.parse(props.location.search);

  if (!Component) return <FallbackComponent {...rest} />;

  if (currentUser || authed) return <Component {...rest} />;

  if (props.data.loading) return <Loading />;

  if (props.data.user && props.data.user.id) return <Component {...rest} />;

  return <FallbackComponent {...rest} />;
};

const mapStateToProps: (*) => * = state => ({
  currentUser: state.users.currentUser,
});
// Connect that component to the Redux state and to the Apollo query for the current user
// By default the data is injected into the Redux state at startup from local storage or from the SSR
// But if it's not there we fall back to showing a global loading indicator and waiting for the Apollo
// query to get the current user to complete
const ConnectedSwitch = compose(
  connect(mapStateToProps),
  getCurrentUser
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
