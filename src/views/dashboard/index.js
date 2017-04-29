//@flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
//$FlowFixMe
import branch from 'recompose/branch';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { Column } from '../../components/column';
import { UserProfile } from '../../components/profile';
import { ErrorMessage } from './style';
import { getEverything } from './queries';
import Loading from '../../components/loading';
import StoryFeed from '../../components/storyFeed';
import StoryComposer from '../../components/storyComposer';
import CommunityProfileCard from '../../components/communityProfileCard';
import AppViewWrapper from '../../components/appViewWrapper';
import {
  logout,
  saveUserDataToLocalStorage,
} from '../../actions/authentication';

const StoryFeedWithData = compose(getEverything)(StoryFeed);

const DashboardPure = () => {
  // if (error) return <ErrorMessage>{error.message}</ErrorMessage>;
  // if (user === null) return <button onClick={logout}>Logout</button>;
  // saveUserDataToLocalStorage(user);
  //
  // const stories = user.everything.edges;
  // const communities = user.communityConnection.edges;
  // const userData = {
  //   photoURL: user.photoURL,
  //   title: user.displayName,
  //   subtitle: user.username,
  //   meta: [], // { icon: 'edit', label: 'Posts', count: '14' }
  // };

  return (
    <AppViewWrapper>

      <Column type="primary" alignItems="center">
        <StoryComposer />
        <StoryFeedWithData />
      </Column>
    </AppViewWrapper>
  );
};

export const Dashboard = pure(DashboardPure);
export default Dashboard;
