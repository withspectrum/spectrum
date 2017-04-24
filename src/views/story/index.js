//@flow
import React from 'react';
//$FlowFixMe
import { Route, Redirect } from 'react-router';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import Card from '../../components/card';
import { StoryContainer } from './containers';

const StoryPure = ({ match }) => (
  <Card>
    {/* story content */}
    <Route path={`${match.url}/:storyId`} component={StoryContainer} />

    {/* if no storyId is provided, redirect to homepage */}
    <Route exact path={match.url} render={() => <Redirect to="/" />} />
  </Card>
);

const Story = compose(pure)(StoryPure);

export default Story;
