// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import {
  CommunityHoverProfile,
  ChannelHoverProfile,
} from 'src/components/hoverProfile';
import { LikeButton } from 'src/components/threadLikes';
import { convertTimestampToDate } from 'shared/time-formatting';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import { CommunityAvatar } from 'src/components/avatar';
import getThreadLink from 'src/helpers/get-thread-link';
import { useAppScroller } from 'src/hooks/useAppScroller';
import {
  StickyHeaderContent,
  CommunityHeaderName,
  CommunityHeaderMeta,
  CommunityHeaderSubtitle,
  CommunityHeaderMetaCol,
  StickyHeaderContainer,
  StickyHeaderActionsContainer,
} from '../style';

type Props = {
  thread: GetThreadType,
};

const StickyHeader = (props: Props) => {
  const { thread } = props;
  const { scrollToTop } = useAppScroller();
  const { channel, community } = thread;

  const createdAt = new Date(thread.createdAt).getTime();
  const timestamp = convertTimestampToDate(createdAt);

  return (
    <StickyHeaderContainer>
      <StickyHeaderContent onClick={scrollToTop}>
        <CommunityHeaderMeta>
          <CommunityAvatar community={community} size={32} />
          <CommunityHeaderMetaCol>
            <CommunityHeaderName>{thread.content.title}</CommunityHeaderName>
            <CommunityHeaderSubtitle>
              <CommunityHoverProfile id={community.id}>
                <Link to={`/${community.slug}`}>{community.name}</Link>
              </CommunityHoverProfile>
              <span>/</span>
              <ChannelHoverProfile id={channel.id}>
                <Link to={`/${community.slug}/${channel.slug}`}>
                  {channel.name}
                </Link>
              </ChannelHoverProfile>
              <Link to={getThreadLink(thread)}>
                &nbsp;
                {`· ${timestamp}`}
              </Link>
            </CommunityHeaderSubtitle>
          </CommunityHeaderMetaCol>
        </CommunityHeaderMeta>
      </StickyHeaderContent>

      {channel.channelPermissions.isMember && (
        <StickyHeaderActionsContainer>
          <LikeButton thread={thread} />
        </StickyHeaderActionsContainer>
      )}
    </StickyHeaderContainer>
  );
};

export default compose(connect())(StickyHeader);
