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

import { Column } from '../../components/column';
import { Profile } from '../../components/profile';
import { DashboardContainer, ErrorMessage } from './style';
import { getEverything } from './queries';
import Loading from '../../components/loading';
import StoryFeedCard from '../../components/storyFeedCard';
import CommunityProfileCard from '../../components/communityProfileCard';

const logout = () => {
  localStorage.clear();
  window.location.href = '/';
};

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(Loading)
);

const DashboardPure = ({ data: { user, error } }) => {
  if (error) return <ErrorMessage>{error.message}</ErrorMessage>;
  if (user === null) return <button onClick={logout}>Logout</button>;
  const stories = user.everything.edges;
  const communities = user.communityConnection.edges;
  const userData = {
    photoURL: user.photoURL,
    title: user.displayName,
    subtitle: user.username,
    meta: [], // { icon: 'edit', label: 'Posts', count: '14' }
  };

  return (
    <DashboardContainer justifyContent={'center'} alignContent={'flex-start'}>
      <Column type={'secondary'}>
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

      <Column type={'primary'}>
        {stories.map(story => {
          return <StoryFeedCard key={story.node.id} data={story.node} />;
        })}
      </Column>

    </DashboardContainer>
  );
};

export const Dashboard = compose(getEverything, displayLoadingState, pure)(
  DashboardPure
);
export default Dashboard;
