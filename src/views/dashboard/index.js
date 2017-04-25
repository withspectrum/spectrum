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
import { Card } from '../../components/card';
import { DashboardContainer } from './style';
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

const dummyUser = {
  photoURL: 'https://pbs.twimg.com/profile_images/570313913648955392/cf4tgX7M_bigger.jpeg',
  title: 'Brian Lovin',
  subtitle: '@brian',
  description: 'Chief Nice Boy™ · Building @withspectrum, @designdetailsfm, @specfm · prev. @facebook, @buffer',
  meta: [
    {
      icon: 'edit',
      label: 'Posts',
      count: '14',
    },
    {
      icon: 'like',
      label: 'Reputation',
      count: '3.2k',
    },
    {
      icon: 'emoji',
      label: 'Friends',
      count: '86',
    },
  ],
};

const DashboardPure = ({ data: { user } }) => {
  const stories = user.everything.edges;
  const communities = user.communityConnection.edges;
  const userData = {
    photoURL: user.photoURL,
    displayName: user.displayName,
    username: user.username,
  };

  return (
    <DashboardContainer justifyContent={'center'} alignContent={'flex-start'}>
      <Column type={'secondary'}>
        {/* User profile */}
        <Profile data={dummyUser} />

        {communities.map(community => {
          return (
            <CommunityProfileCard
              key={community.node.id}
              data={community.node}
            />
          );
        })}
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
