// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import StoryFeed from '../../components/storyFeed';
import { UserProfile } from '../../components/profile';
import { getUserStories, getUserProfile } from './queries';

const enhanceStoryFeed = compose(getUserStories);
const StoryFeedWithData = enhanceStoryFeed(StoryFeed);

const enhanceProfile = compose(getUserProfile);
const UserProfileWithData = enhanceProfile(UserProfile);

const UserViewPure = ({ match }) => {
  const username = match.params.username;

  return (
    <AppViewWrapper>
      <Column type="secondary">
        <UserProfileWithData username={username} profileSize="full" />
      </Column>

      <Column type="primary" alignItems="center">
        <StoryFeedWithData username={username} />
      </Column>
    </AppViewWrapper>
  );
};

export const UserView = pure(UserViewPure);
export default UserView;
