//@flow
import React from 'react';
import { Route, Redirect } from 'react-router';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { Container } from './style';
import { StoryContainer } from './containers';

const StoryPure = ({ match }) => (
  <Container>
    {/* story content */}
    <Route path={`${match.url}/:storyId`} component={StoryContainer} />

    {/* if no storyId is provided, redirect to homepage */}
    <Route exact path={match.url} render={() => <Redirect to="/" />} />
  </Container>
);

const Story = compose(pure)(StoryPure);

export default Story;
