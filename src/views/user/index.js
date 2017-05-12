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
import { displayLoadingScreen } from '../../components/loading';
import { Upsell404User } from '../../components/upsell';
import { getUserStories, getUser } from './queries';

const StoryFeedWithData = compose(getUserStories)(StoryFeed);

const UserViewPure = ({ match, data: { user, error } }) => {
  const username = match.params.username;

  if (error) {
    return <Upsell404User username={username} />;
  }

  if (!user) {
    return <Upsell404User username={username} />;
  }

  return (
    <AppViewWrapper>
      <Column type="secondary">
        <UserProfile data={{ user }} username={username} profileSize="full" />
      </Column>

      <Column type="primary" alignItems="center">
        <StoryFeedWithData username={username} />
      </Column>
    </AppViewWrapper>
  );
};

export const UserView = compose(getUser, displayLoadingScreen, pure)(
  UserViewPure
);
export default UserView;
