//@flow
import React from 'react';
//$FlowFixMe
import { Route, Redirect } from 'react-router';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import { Link } from 'react-router-dom';
import Card from '../../components/card';
import { StoryContainer } from './containers';
import { Column } from '../../components/column';
import { FlexContainer } from '../../components/flexbox';
import WithTransition from '../../components/routeTransition';

const StoryPure = ({ match, location }) => (
  <WithTransition location={location}>
    {/* story content */}
    <Route
      location={location}
      key={location.key}
      path={`${match.url}/:storyId`}
      component={StoryContainer}
    />

    {/* if no storyId is provided, redirect to homepage */}
    <Route exact path={match.url} render={() => <Redirect to="/" />} />
  </WithTransition>
);

const Story = compose(pure)(StoryPure);

export default Story;
