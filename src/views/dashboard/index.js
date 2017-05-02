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
import { getEverythingStories, getCurrentUserProfile } from './queries';
import { Loading } from '../../components/loading';
import StoryFeed from '../../components/storyFeed';
import StoryComposer from '../../components/storyComposer';
import AppViewWrapper from '../../components/appViewWrapper';
import {
  logout,
  saveUserDataToLocalStorage,
} from '../../actions/authentication';

const enhanceStoryFeed = compose(getEverythingStories);
const StoryFeedWithData = enhanceStoryFeed(StoryFeed);

const enhanceProfile = compose(getCurrentUserProfile);
const UserProfileWithData = enhanceProfile(UserProfile);

const DashboardPure = () => {
  return (
    <AppViewWrapper>
      <Column type="secondary">
        <UserProfileWithData profileSize="full" />
      </Column>

      <Column type="primary" alignItems="center">
        <StoryComposer />
        <StoryFeedWithData />
      </Column>
    </AppViewWrapper>
  );
};

export const Dashboard = pure(DashboardPure);
export default Dashboard;
