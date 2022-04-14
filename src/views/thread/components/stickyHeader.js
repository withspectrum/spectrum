// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import { truncate } from 'src/helpers/utils';
import { UserAvatar } from 'src/components/avatar';
import { LikeButton } from 'src/components/threadLikes';
import { convertTimestampToDate } from 'shared/time-formatting';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import getThreadLink from 'src/helpers/get-thread-link';
import { useAppScroller } from 'src/hooks/useAppScroller';
import ActionsDropdown from './actionsDropdown';
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
  const { channel } = thread;

  const createdAt = new Date(thread.createdAt).getTime();
  const timestamp = convertTimestampToDate(createdAt);

  return (
    <StickyHeaderContainer>
      <StickyHeaderContent onClick={scrollToTop}>
        <CommunityHeaderMeta>
          <UserAvatar
            showHoverProfile
            showOnlineStatus
            username={thread.author.user.username}
          />
          <CommunityHeaderMetaCol>
            <CommunityHeaderName>
              {truncate(thread.content.title, 80)}
            </CommunityHeaderName>
            <CommunityHeaderSubtitle>
              <Link to={getThreadLink(thread)}>{timestamp}</Link>
            </CommunityHeaderSubtitle>
          </CommunityHeaderMetaCol>
        </CommunityHeaderMeta>
      </StickyHeaderContent>

      {channel.channelPermissions.isMember && (
        <StickyHeaderActionsContainer>
          <ActionsDropdown thread={thread} />
          <LikeButton thread={thread} />
        </StickyHeaderActionsContainer>
      )}
    </StickyHeaderContainer>
  );
};

export default compose(connect())(StickyHeader);
