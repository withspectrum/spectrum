// @flow
// $FlowIssue
import React, { useEffect } from 'react';
import theme from 'shared/theme';
import MembersList from './MembersList';
import type { CommunityFeedsType } from '../types';
import { TeamMembersList } from './TeamMembersList';
import { MobileCommunityInfoActions } from './MobileCommunityInfoActions';
import { ChannelsList } from './ChannelsList';
import { CommunityMeta } from 'src/components/Entities/ProfileCards/components/CommunityMeta';
import { WatercoolerChat } from './WatercoolerChat';
import { PostsFeeds } from './PostsFeeds';
import { ARROW_LEFT, ARROW_RIGHT } from 'src/helpers/keycodes';
import { SegmentedControl, Segment } from 'src/components/segmentedControl';
import { FeedsContainer, SidebarSection } from '../style';

export const CommunityFeeds = (props: CommunityFeedsType) => {
  const {
    community,
    scrollToTop,
    scrollToPosition,
    scrollToBottom,
    contextualScrollToBottom,
  } = props;
  const defaultSegment = community.watercoolerId ? 'chat' : 'posts';
  const [activeSegment, setActiveSegment] = React.useState(defaultSegment);

  const renderFeed = () => {
    switch (activeSegment) {
      case 'chat': {
        if (!community.watercoolerId) return null;
        return (
          <WatercoolerChat
            scrollToBottom={scrollToBottom}
            contextualScrollToBottom={contextualScrollToBottom}
            scrollToPosition={scrollToPosition}
            community={community}
            isWatercooler
            id={community.watercoolerId}
          />
        );
      }
      case 'posts': {
        return <PostsFeeds community={community} />;
      }
      case 'members': {
        return (
          <MembersList
            id={community.id}
            filter={{ isMember: true, isBlocked: false }}
          />
        );
      }
      case 'info': {
        return (
          <div style={{ paddingBottom: '64px', background: theme.bg.wash }}>
            <SidebarSection>
              <CommunityMeta community={community} />
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
      default:
        return null;
    }
  };

  /*
    Segments preserve scroll position when switched by default. We dont want
    this behavior - if you change the feed (eg threads => members) you should
    always end up at the top of the list. However, if the next active segment
    is chat, we want that scrolled to the bottom by default, since the behavior
    of chat is to scroll up for older messages
  */
  useEffect(
    () => {
      if (activeSegment === 'chat') scrollToBottom();
      scrollToTop();
    },
    [activeSegment]
  );

  const segments = ['posts', 'members', 'info'];
  if (community.watercoolerId) segments.unshift('chat');

  useEffect(
    () => {
      if (activeSegment === 'chat') {
        if (!community.watercoolerId) {
          setActiveSegment('posts');
        }
      }
    },
    [community.slug]
  );

  /*
    Allow people to alt + left/right key through tabs
  */
  useEffect(
    () => {
      const handleKeyDown = (e: any) => {
        if (e.altKey) {
          // info tab is only available on mobile where keydowns are not likely
          // to happen
          const segmentsWithoutInfo = segments.filter(s => s !== 'info');
          const currentSegmentIndex = segmentsWithoutInfo.indexOf(
            activeSegment
          );

          if (e.keyCode === ARROW_LEFT) {
            if (currentSegmentIndex === 0)
              return setActiveSegment(
                segmentsWithoutInfo[segmentsWithoutInfo.length - 1]
              );
            return setActiveSegment(
              segmentsWithoutInfo[currentSegmentIndex - 1]
            );
          }

          if (e.keyCode === ARROW_RIGHT) {
            if (currentSegmentIndex === segmentsWithoutInfo.length - 1)
              return setActiveSegment(segmentsWithoutInfo[0]);
            return setActiveSegment(
              segmentsWithoutInfo[currentSegmentIndex + 1]
            );
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown, false);
      return () =>
        document.removeEventListener('keydown', handleKeyDown, false);
    },
    [segments, activeSegment]
  );

  return (
    <FeedsContainer>
      <SegmentedControl mobileStickyOffset={52}>
        {segments.map(segment => {
          return (
            <Segment
              key={segment}
              hideOnDesktop={segment === 'info'}
              isActive={segment === activeSegment}
              onClick={() => setActiveSegment(segment)}
            >
              {segment[0].toUpperCase() + segment.substr(1)}
            </Segment>
          );
        })}
      </SegmentedControl>
      {renderFeed()}
    </FeedsContainer>
  );
};
