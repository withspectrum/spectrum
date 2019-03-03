// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import theme from 'shared/theme';
import getCommunityThreads from 'shared/graphql/queries/community/getCommunityThreadConnection';
import ThreadFeed from 'src/components/threadFeed';
import CommunityMemberGrid from 'src/views/community/components/memberGrid';
import type { CommunityFeedsType } from '../types';
import { TeamMembersList } from './TeamMembersList';
import { MobileCommunityInfoActions } from './MobileCommunityInfoActions';
import { ChannelsList } from './ChannelsList';
import { CommunityMeta } from './CommunityMeta';
import {
  FeedsContainer,
  SegmentedControl,
  Segment,
  SidebarSection,
} from '../style';

const CommunityThreadFeed = compose(
  connect(),
  getCommunityThreads
)(ThreadFeed);

export const CommunityFeeds = (props: CommunityFeedsType) => {
  const { community, scrollToTop } = props;
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
        return (
          <div style={{ paddingBottom: '64px', background: theme.bg.wash }}>
            <SidebarSection>
              <CommunityMeta community={community} />
              <div style={{ height: '24px' }} />
            </SidebarSection>

            <SidebarSection>
              <TeamMembersList
                community={community}
                id={community.id}
                first={100}
                filter={{ isModerator: true, isOwner: true }}
              />
            </SidebarSection>

            <SidebarSection>
              <ChannelsList id={community.id} communitySlug={community.slug} />
            </SidebarSection>

            <SidebarSection>
              <MobileCommunityInfoActions community={community} />
            </SidebarSection>
          </div>
        );
      }
    }
  };

  /*
    Segments preserve scroll position when switched by default. We dont want
    this behavior - if you change the feed (eg threads => members) you should
    always end up at the top of the list
  */
  const changeSegment = (segment: string) => {
    scrollToTop();
    return setActiveSegment(segment);
  };

  return (
    <FeedsContainer>
      <SegmentedControl>
        <Segment
          active={activeSegment === 'trending'}
          onClick={() => changeSegment('trending')}
        >
          Trending
        </Segment>

        <Segment
          active={activeSegment === 'latest'}
          onClick={() => changeSegment('latest')}
        >
          Latest
        </Segment>

        <Segment
          active={activeSegment === 'members'}
          onClick={() => changeSegment('members')}
        >
          Members
        </Segment>

        <Segment
          hideOnDesktop
          active={activeSegment === 'about'}
          onClick={() => changeSegment('about')}
        >
          About
        </Segment>
      </SegmentedControl>

      {renderFeed()}
    </FeedsContainer>
  );
};
