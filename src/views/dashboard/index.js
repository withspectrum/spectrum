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
import { Button } from '../../components/buttons';
import { Profile } from '../../components/profile';
import { ErrorMessage } from './style';
import { getEverything } from './queries';
import Loading from '../../components/loading';
import StoryFeedCard from '../../components/storyFeedCard';
import StoryComposer from '../../components/storyComposer';
import CommunityProfileCard from '../../components/communityProfileCard';
import AppViewWrapper from '../../components/appViewWrapper';
import {
  logout,
  saveUserDataToLocalStorage,
} from '../../actions/authentication';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(Loading)
);

const DashboardPure = ({ data: { user, error, fetchMore }, data }) => {
  if (error) return <ErrorMessage>{error.message}</ErrorMessage>;
  if (user === null) return <button onClick={logout}>Logout</button>;
  saveUserDataToLocalStorage(user);

  const stories = user.everything.edges;
  const communities = user.communityConnection.edges;
  const userData = {
    photoURL: user.photoURL,
    title: user.displayName,
    subtitle: user.username,
    meta: [], // { icon: 'edit', label: 'Posts', count: '14' }
  };

  return (
    <AppViewWrapper>
      <Column type="secondary">
        {/* User profile */}
        <Profile data={userData} />

        {communities.map(community => {
          return (
            <CommunityProfileCard
              key={community.node.id}
              data={community.node}
            />
          );
        })}

        <button onClick={logout}>Logout</button>
      </Column>

      <Column type="primary" alignItems={'center'}>
        <StoryComposer />

        {stories.map(story => {
          return <StoryFeedCard key={story.node.id} data={story.node} />;
        })}

        <Button onClick={fetchMore}>Fetch More</Button>
      </Column>
    </AppViewWrapper>
  );
};

export const Dashboard = compose(getEverything, displayLoadingState, pure)(
  DashboardPure
);
export default Dashboard;
