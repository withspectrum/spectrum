// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Icon from 'src/components/icons';
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
};

const MessageCount = props => {
  const {
    thread: { messageCount, createdAt, currentUserLastSeen, lastActive },
    active,
  } = props;

  const now = new Date().getTime() / 1000;
  const createdAtTime = new Date(createdAt).getTime() / 1000;
  const lastActiveTime = lastActive && new Date(lastActive).getTime() / 1000;
  const createdMoreThanOneDayAgo = now - createdAtTime > 86400;
  const newMessagesSinceLastWeek =
    lastActiveTime && now - lastActiveTime > 86400 * 7;
  const newMessagesSinceLastViewed =
    currentUserLastSeen && lastActive && currentUserLastSeen < lastActive;

  if (!currentUserLastSeen && !createdMoreThanOneDayAgo) {
    return <NewThreadPill active={active}>New thread!</NewThreadPill>;
  }

  return (
    <CountWrapper
      active={active}
      newMessages={newMessagesSinceLastViewed && newMessagesSinceLastWeek}
    >
      <Icon glyph="message-fill" size={24} />
      <span>{messageCount}</span>
    </CountWrapper>
  );
};

const ThreadActivity = props => {
  const { thread, active } = props;

  if (!thread) return null;

  return (
    <ThreadActivityWrapper>
      <MessageCount thread={thread} active={active} />
      <LikeCount thread={thread} active={active} />
    </ThreadActivityWrapper>
  );
};

const ThreadStatus = props => {
  const {
    thread: { id, isLocked, community, channel },
    thread,
    active,
  } = props;
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
          tipLocation={'top-left'}
        />
      )}
      {(community.isPrivate || channel.isPrivate) && (
        <Icon
          size={24}
          className={'private'}
          glyph={'private-fill'}
          tipText="Private"
          tipLocation={'top-left'}
        />
      )}
      {isLocked && (
        <Icon
          size={24}
          className={'locked'}
          glyph={'private'}
          tipText="Locked"
          tipLocation={'top-left'}
        />
      )}
    </ThreadStatusWrapper>
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

export default compose(connect(), withRouter)(InboxThread);

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
