// @flow
// $FlowIssue
import React, { useEffect } from 'react';
import theme from 'shared/theme';
import MembersList from './membersList';
import type { CommunityFeedsType } from '../types';
import { TeamMembersList } from './teamMembersList';
import { MobileCommunityInfoActions } from './mobileCommunityInfoActions';
import { ChannelsList } from './channelsList';
import { CommunityMeta } from 'src/components/entities/profileCards/components/communityMeta';
import MessagesSubscriber from '../../thread/components/messagesSubscriber';
import { PostsFeeds } from './postsFeeds';
import { SegmentedControl, Segment } from 'src/components/segmentedControl';
import { useAppScroller } from 'src/hooks/useAppScroller';
import ChatInput from 'src/components/chatInput';
import { ChatInputWrapper } from 'src/components/layout';
import { FeedsContainer, SidebarSection } from '../style';
import { Stretch } from '../../thread/style';

export const CommunityFeeds = (props: CommunityFeedsType) => {
  const { community } = props;
  const defaultSegment = community.watercoolerId ? 'chat' : 'posts';
  const [activeSegment, setActiveSegment] = React.useState(defaultSegment);

  const renderFeed = () => {
    switch (activeSegment) {
      case 'chat': {
        if (!community.watercoolerId) return null;
        return (
          <React.Fragment>
            <Stretch>
              <MessagesSubscriber isWatercooler id={community.watercoolerId} />
            </Stretch>
            <ChatInputWrapper>
              <ChatInput
                threadType="story"
                threadId={community.watercoolerId}
              />
            </ChatInputWrapper>
          </React.Fragment>
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
            <SidebarSection style={{ paddingBottom: '16px' }}>
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
  const { scrollToBottom, scrollToTop } = useAppScroller();
  useEffect(() => {
    if (activeSegment === 'chat') {
      scrollToBottom();
    } else {
      scrollToTop();
    }
  }, [activeSegment, community.slug]);

  const segments = ['posts', 'members', 'info'];
  if (community.watercoolerId) segments.unshift('chat');

  // if the community being viewed changes, and the previous community had
  // a watercooler but the next one doesn't, select the posts tab on the new one
  useEffect(() => {
    if (activeSegment === 'chat') {
      if (!community.watercoolerId) {
        setActiveSegment('posts');
      }
    }
  }, [community.slug]);

  return (
    <FeedsContainer>
      <SegmentedControl>
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
