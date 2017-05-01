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
import { getUser, getUserProfile } from './queries';

const enhanceStoryFeed = compose(getUser);
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
