//@flow
import React from 'react';
//$FlowFixMe
import { Route, Redirect } from 'react-router';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import ThreadContainer from './containers';

const ThreadPure = ({ match, location }) => (
  <div>

    {/* if a threadId is provided in the url */}
    <Route
      location={location}
      key={location.key}
      path={`${match.url}/:threadId`}
      component={ThreadContainer}
    />

    {/* if no threadId is provided, redirect to homepage */}
    <Route exact path={match.url} render={() => <Redirect to="/" />} />
  </div>
);

const Thread = compose(pure)(ThreadPure);

export default Thread;
