//@flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { Column } from '../../components/column';
import { UserProfile } from '../../components/profile';
import { getEverythingStories, getCurrentUserProfile } from './queries';
import StoryFeed from '../../components/storyFeed';
import StoryComposer from '../../components/storyComposer';
import AppViewWrapper from '../../components/appViewWrapper';
import { saveUserDataToLocalStorage } from '../../actions/authentication';

const enhanceStoryFeed = compose(getEverythingStories);
const StoryFeedWithData = enhanceStoryFeed(StoryFeed);

const enhanceProfile = compose(getCurrentUserProfile);
const UserProfileWithData = enhanceProfile(UserProfile);

const DashboardPure = ({ data: { user }, dispatch }) => {
  // save user data to localstorage, which will also dispatch an action to put
  // the user into the redux store
  if (user) {
    dispatch(saveUserDataToLocalStorage(user));
  }

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

/*
  This is bad, but necessary for now!
  I'm wrapping DashboardPure in a query for getCurrentUserProfile so that I
  can store the user in localStorage and redux for any downstream actions
*/
const Dashboard = compose(getCurrentUserProfile, pure)(DashboardPure);
export default connect()(Dashboard);
