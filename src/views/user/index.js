// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import ThreadFeed from '../../components/threadFeed';
import { UserProfile } from '../../components/profile';
import { displayLoadingScreen } from '../../components/loading';
import { Button } from '../../components/buttons';
import { NullCard, Upsell404User } from '../../components/upsell';
import { getUserThreads, getUser } from './queries';

const ThreadFeedWithData = compose(getUserThreads)(ThreadFeed);

const UserViewPure = ({ match, data: { user, error, channel, community } }) => {
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
        {user.threadCount === 0 &&
          <NullCard
            bg="message"
            heading={`${user.name} hasn't posted anything yet.`}
            copy={`You could always try messaging them, though!`}
          >
            <Button icon="message">{`Message @${username}`}</Button>
          </NullCard>}
        {user.threadCount > 0 &&
          <ThreadFeedWithData username={username} viewContext="profile" />}
      </Column>
    </AppViewWrapper>
  );
};

export const UserView = compose(getUser, displayLoadingScreen, pure)(
  UserViewPure
);
export default UserView;
