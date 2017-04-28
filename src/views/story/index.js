//@flow
import React from 'react';
//$FlowFixMe
import { Route, Redirect } from 'react-router';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import { StoryContainer } from './containers';
import AppViewWrapper from '../../components/appViewWrapper';
import WithTransition from '../../components/routeTransition';

const StoryPure = ({ match, location }) => (
  <AppViewWrapper>
    {/* story content */}
    <Route
      location={location}
      key={location.key}
      path={`${match.url}/:storyId`}
      component={StoryContainer}
    />

    {/* if no storyId is provided, redirect to homepage */}
    <Route exact path={match.url} render={() => <Redirect to="/" />} />
  </AppViewWrapper>
);

const Story = compose(pure)(StoryPure);

export default Story;
