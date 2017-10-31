//@flow
import React from 'react';
//$FlowFixMe
import { Route } from 'react-router';
//$FlowFixMe
import compose from 'recompose/compose';
import ThreadContainer from './containers';

const ThreadPure = ({ match, location }) => (
  <Route
    location={location}
    key={location.key}
    path={`${match.url}/:threadId`}
    component={ThreadContainer}
  />
);

const Thread = compose()(ThreadPure);

export default Thread;
