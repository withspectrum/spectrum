// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Icon from 'src/components/icons';
import Link from 'src/components/link';
import Avatar from 'src/components/avatar';
import { LikeCount } from 'src/components/threadLikes';
import truncate from 'shared/truncate';
import ThreadCommunityInfo, { WaterCoolerPill } from './threadCommunityInfo';
import { changeActiveThread } from 'src/actions/dashboardFeed';
import type { ThreadInfoType } from 'shared/graphql/fragments/thread/threadInfo';
import type { Dispatch } from 'redux';
import {
  InboxThreadItem,
  InboxLinkWrapper,
  InboxThreadContent,
  ThreadTitle,
  ThreadMeta,
  ThreadActivityWrapper,
  ThreadStatusWrapper,
  CountWrapper,
  NewThreadPill,
  ThreadAuthorWrapper,
} from '../style';
import { ErrorBoundary } from 'src/components/error';

type Props = {
  active: boolean,
  dispatch: Dispatch<Object>,
  hasActiveChannel: ?string,
  hasActiveCommunity: ?string,
  history: Object,
  location: Object,
  match: Object,
  staticContext: ?string,
  data: ThreadInfoType,
  viewContext?: ?string,
  pinnedThreadId?: ?string,
  currentUser: ?Object,
};

const MessageCount = props => {
  const {
    thread: { messageCount, currentUserLastSeen, lastActive },
    active,
  } = props;

  const now = new Date().getTime() / 1000;
  const lastActiveTime = lastActive && new Date(lastActive).getTime() / 1000;
  const newMessagesSinceLastWeek =
    lastActiveTime && now - lastActiveTime > 86400 * 7;
  const newMessagesSinceLastViewed =
    currentUserLastSeen && lastActive && currentUserLastSeen < lastActive;

  return (
    <CountWrapper
      active={active}
      newMessages={newMessagesSinceLastViewed && newMessagesSinceLastWeek}
    >
      <Icon
        glyph="message-fill"
        size={24}
        tipText={`${messageCount} messages`}
        tipLocation={'top-right'}
      />
      <span>{messageCount}</span>
    </CountWrapper>
  );
};

const ThreadActivity = props => {
  const {
    thread,
    thread: { createdAt, currentUserLastSeen },
    active,
    currentUser,
  } = props;

  if (!thread) return null;

  const now = new Date().getTime() / 1000;
  const createdAtTime = new Date(createdAt).getTime() / 1000;
  const createdMoreThanOneDayAgo = now - createdAtTime > 86400;
  const isAuthor = currentUser && currentUser.id === thread.author.user.id;

  if (!isAuthor && !currentUserLastSeen && !createdMoreThanOneDayAgo) {
    return <NewThreadPill active={active}>New thread!</NewThreadPill>;
  }

  if (thread.isLocked) {
    return (
      <ThreadActivityWrapper>
        <ThreadStatusWrapper active={active}>
          <Icon
            size={24}
            className={'locked'}
            glyph={'private'}
            tipText="Locked"
            tipLocation={'top-right'}
          />
        </ThreadStatusWrapper>
      </ThreadActivityWrapper>
    );
  }

  return (
    <ThreadActivityWrapper>
      <MessageCount thread={thread} active={active} />
      <LikeCount thread={thread} active={active} />
    </ThreadActivityWrapper>
  );
};

const ThreadStatus = props => {
  const { thread: { id, community }, thread, active } = props;
  const isPinned = id === community.pinnedThreadId;
  if (!thread) return null;

  return (
    <ThreadStatusWrapper active={active}>
      {isPinned && (
        <Icon
          size={24}
          className={'pinned'}
          glyph={'pin-fill'}
          tipText={`Pinned in ${community.name}`}
          tipLocation={'top-right'}
        />
      )}
    </ThreadStatusWrapper>
  );
};

const ThreadAuthor = props => {
  const { author: { user } } = props.thread;
  if (!user.username) {
    return (
      <ThreadAuthorWrapper tipText={`By ${user.name}`} tipLocation={'top-left'}>
        <Avatar src={user.profilePhoto} size={'24'} />
      </ThreadAuthorWrapper>
    );
  }
  return (
    <ThreadAuthorWrapper tipText={`By ${user.name}`} tipLocation={'top-left'}>
      <Link to={`/users/${user.username}`} style={{ display: 'flex' }}>
        <Avatar src={user.profilePhoto} size={'24'} />
      </Link>
    </ThreadAuthorWrapper>
  );
};

class InboxThread extends React.Component<Props> {
  render() {
    const {
      data,
      location,
      active,
      hasActiveCommunity,
      hasActiveChannel,
      viewContext,
      currentUser,
    } = this.props;
    const isPinned = data.id === this.props.pinnedThreadId;

    if (data.watercooler) {
      return (
        <WatercoolerThread
          data={data}
          active={active}
          viewContext={viewContext}
        />
      );
    }

    return (
      <ErrorBoundary fallbackComponent={null}>
        <InboxThreadItem active={active}>
          <InboxLinkWrapper
            to={{
              pathname: location.pathname,
              search:
                // TODO(@mxstbr): Fix this to not use window.innerWidth
                // which breaks SSR rehydration on mobile devices
                window.innerWidth < 768 || viewContext
                  ? `?thread=${data.id}`
                  : `?t=${data.id}`,
            }}
            onClick={e =>
              window.innerWidth > 768 &&
              !viewContext &&
              !e.metaKey &&
              this.props.dispatch(changeActiveThread(data.id))
            }
          />
          <InboxThreadContent>
            <ErrorBoundary fallbackComponent={null}>
              <ThreadCommunityInfo
                thread={data}
                active={active}
                activeCommunity={hasActiveCommunity}
                activeChannel={hasActiveChannel}
                isPinned={isPinned}
              />
            </ErrorBoundary>

            <ThreadTitle active={active}>
              {truncate(data.content.title, 80)}
            </ThreadTitle>
            <ThreadMeta>
              <ErrorBoundary fallbackComponent={null}>
                <ThreadActivity
                  thread={data}
                  active={active}
                  currentUser={currentUser}
                />
                <ThreadStatus thread={data} active={active} />
                <ThreadAuthor thread={data} />
              </ErrorBoundary>
            </ThreadMeta>
          </InboxThreadContent>
        </InboxThreadItem>
      </ErrorBoundary>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
// $FlowFixMe
export default compose(connect(map), withRouter)(InboxThread);

class WatercoolerThreadPure extends React.Component<Props> {
  render() {
    const {
      data: { community, id },
      data,
      location,
      active,
      viewContext,
    } = this.props;

    return (
      <ErrorBoundary fallbackComponent={null}>
        <InboxThreadItem active={active}>
          <InboxLinkWrapper
            to={{
              pathname: location.pathname,
              search:
                // TODO(@mxstbr): Fix this to not use window.innerWidth
                // which breaks SSR rehydration on mobile devices
                window.innerWidth < 768 || viewContext
                  ? `?thread=${id}`
                  : `?t=${id}`,
            }}
            onClick={() =>
              window.innerWidth > 768 &&
              this.props.dispatch(changeActiveThread(id))
            }
          />
          <InboxThreadContent>
            <WaterCoolerPill thread={data} active={active} />
            <ThreadTitle active={active}>
              {community.name} Watercooler
            </ThreadTitle>

            <ThreadMeta>
              <ErrorBoundary fallbackComponent={null}>
                <ThreadActivity thread={data} active={active} />
                <ThreadStatus thread={data} active={active} />
              </ErrorBoundary>
            </ThreadMeta>
          </InboxThreadContent>
        </InboxThreadItem>
      </ErrorBoundary>
    );
  }
}

export const WatercoolerThread = compose(connect(), withRouter)(
  WatercoolerThreadPure
);
