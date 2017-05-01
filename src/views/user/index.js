import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import withProps from 'recompose/withProps';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import StoryFeed from '../../components/storyFeed';
import { UserProfile } from '../../components/profile';
import { getUser, getUserProfile } from './queries';

const UserViewPure = ({ match }) => {
  const enhanceStoryFeed = compose(withProps({ match }), getUser);
  const StoryFeedWithData = enhanceStoryFeed(StoryFeed);

  const enhanceProfile = compose(withProps({ match }), getUserProfile);
  const UserProfileWithData = enhanceProfile(UserProfile);

  return (
    <AppViewWrapper>
      <Column type="secondary">
        <UserProfileWithData profileSize="full" />
      </Column>
      <Column type="primary" alignItems="center">
        <StoryFeedWithData />
      </Column>
    </AppViewWrapper>
  );
};

export const UserView = pure(UserViewPure);
export default UserView;
