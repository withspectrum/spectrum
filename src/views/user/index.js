// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import { connect } from 'react-redux';
import generateMetaInfo from 'shared/generate-meta-info';
import AppViewWrapper from '../../components/appViewWrapper';
import Head from '../../components/head';
import Column from '../../components/column';
import ThreadFeed from '../../components/threadFeed';
import { track } from '../../helpers/events';
import { UserProfile } from '../../components/profile';
import { LoadingScreen } from '../../components/loading';
import { NullState, Upsell404User } from '../../components/upsell';
import CommunityList from './components/communityList';
import { getUserThreads, getUser } from './queries';
import Titlebar from '../titlebar';

const ThreadFeedWithData = compose(connect(), getUserThreads)(ThreadFeed);

const UserViewPure = ({
  match,
  data: { user, networkStatus, channel, community, error },
  data,
  currentUser,
}) => {
  track('user', 'profile viewed', null);

  const username = match.params.username;
  const dataExists = user;

  if (networkStatus === 8 || error) {
    return (
      <AppViewWrapper>
        <Titlebar
          title={`No User Found`}
          provideBack={true}
          backRoute={`/`}
          noComposer
        />

        <Column type="primary" alignItems="center">
          <Upsell404User username={username} />
        </Column>
      </AppViewWrapper>
    );
  }

  if (dataExists) {
    const { title, description } = generateMetaInfo({
      type: 'user',
      data: {
        name: user.name,
        username: user.username,
        description: user.description,
      },
    });

    return (
      <AppViewWrapper>
        <Head title={title} description={description} />
        <Titlebar
          title={user.name}
          subtitle={'Posts By'}
          provideBack={true}
          backRoute={`/`}
          noComposer
        />
        <Column type="secondary">
          <UserProfile data={{ user }} username={username} profileSize="full" />
          <CommunityList
            withMeta={false}
            withDescription={true}
            currentUser={currentUser}
            profileSize="small"
            user={user}
            networkStatus={networkStatus}
            communities={user.communityConnection.edges}
          />
        </Column>

        <Column type="primary" alignItems="center">
          {user.threadCount === 0 && (
            <NullState
              bg="message"
              heading={`${user.name} hasn't posted anything yet.`}
            />
          )}
          {user.threadCount > 0 && (
            <ThreadFeedWithData username={username} viewContext="profile" />
          )}
        </Column>
      </AppViewWrapper>
    );
  }

  if (networkStatus === 7) {
    // data is ready, but no user exists
    return (
      <AppViewWrapper>
        <Titlebar
          title={`No User Found`}
          provideBack={true}
          backRoute={`/`}
          noComposer
        />

        <Column type="primary" alignItems="center">
          <Upsell404User username={username} />
        </Column>
      </AppViewWrapper>
    );
  } else {
    return <LoadingScreen />;
  }
};

const mapStateToProps = state => ({ currentUser: state.users.currentUser });
const ConnectedUserView = connect(mapStateToProps)(UserViewPure);

export const UserView = compose(getUser, pure)(ConnectedUserView);

export default UserView;
