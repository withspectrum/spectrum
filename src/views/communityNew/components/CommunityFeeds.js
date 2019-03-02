// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import getCommunityThreads from 'shared/graphql/queries/community/getCommunityThreadConnection';
import ThreadFeed from 'src/components/threadFeed';
import CommunityMemberGrid from 'src/views/community/components/memberGrid';
import type { CommunityFeedsType } from '../types';
import { FeedsContainer, SegmentedControl, Segment } from '../style';

const CommunityThreadFeed = compose(
  connect(),
  getCommunityThreads
)(ThreadFeed);

export const CommunityFeeds = (props: CommunityFeedsType) => {
  const { community } = props;
  const [activeSegment, setActiveSegment] = React.useState('trending');

  const renderFeed = () => {
    switch (activeSegment) {
      case 'trending': {
        return (
          <CommunityThreadFeed
            viewContext="communityProfile"
            slug={community.slug}
            id={community.id}
            setThreadsStatus={false}
            isNewAndOwned={false}
            community={community}
            pinnedThreadId={community.pinnedThreadId}
            sort={'trending'}
          />
        );
      }
      case 'latest': {
        return (
          <CommunityThreadFeed
            viewContext="communityProfile"
            slug={community.slug}
            id={community.id}
            setThreadsStatus={false}
            isNewAndOwned={false}
            community={community}
            pinnedThreadId={community.pinnedThreadId}
            sort={'latest'}
          />
        );
      }
      case 'members': {
        return (
          <CommunityMemberGrid
            id={community.id}
            filter={{ isMember: true, isBlocked: false }}
          />
        );
      }
      case 'about': {
        return <p>About!</p>;
      }
    }
  };

  return (
    <FeedsContainer>
      <SegmentedControl>
        <Segment
          active={activeSegment === 'trending'}
          onClick={() => setActiveSegment('trending')}
        >
          Trending
        </Segment>

        <Segment
          active={activeSegment === 'latest'}
          onClick={() => setActiveSegment('latest')}
        >
          Latest
        </Segment>

        <Segment
          active={activeSegment === 'members'}
          onClick={() => setActiveSegment('members')}
        >
          Members
        </Segment>

        <Segment
          hideOnDesktop
          active={activeSegment === 'about'}
          onClick={() => setActiveSegment('about')}
        >
          About
        </Segment>
      </SegmentedControl>

      {renderFeed()}
    </FeedsContainer>
  );
};
