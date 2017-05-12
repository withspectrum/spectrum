//@flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';

import {
  getEverythingStories,
  getCurrentUserProfile,
  getCurrentUserCommunities,
} from './queries';
import { saveUserDataToLocalStorage } from '../../actions/authentication';

import { Column } from '../../components/column';
import { UserProfile } from '../../components/profile';
import StoryFeed from '../../components/storyFeed';
import StoryComposer from '../../components/storyComposer';
import AppViewWrapper from '../../components/appViewWrapper';
import ListCard from './components/listCard';

const EverythingStoryFeed = compose(getEverythingStories)(StoryFeed);

const CurrentUserProfile = compose(getCurrentUserProfile)(UserProfile);

const CommunitiesListCard = compose(getCurrentUserCommunities)(ListCard);

const DashboardPure = ({ data: { user, error }, data, dispatch }) => {
  // save user data to localstorage, which will also dispatch an action to put
  // the user into the redux store
  if (user) {
    dispatch(saveUserDataToLocalStorage(user));
  }

  if (error) {
    return (
      <AppViewWrapper>
        <Column type="primary" alignItems="center">
          Error loading home page
        </Column>
      </AppViewWrapper>
    );
  }

  return (
    <AppViewWrapper>
      <Column type="secondary">
        <CurrentUserProfile profileSize="full" />
        <CommunitiesListCard />
      </Column>

      <Column type="primary" alignItems="center">
        <StoryComposer />
        <EverythingStoryFeed />
      </Column>
    </AppViewWrapper>
  );
};

/*
  This is bad, but necessary for now!
  I'm wrapping DashboardPure in a query for getCurrentUserProfile so that I
  can store the user in localStorage and redux for any downstream actions
*/
const Dashboard = compose(getCurrentUserProfile, pure)(DashboardPure);
export default connect()(Dashboard);
