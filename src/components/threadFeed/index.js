// @flow
import * as React from 'react';
import styled from 'styled-components';
import compose from 'recompose/compose';
// NOTE(@mxstbr): This is a custom fork published of off this (as of this writing) unmerged PR: https://github.com/CassetteRocks/react-infinite-scroller/pull/38
// I literally took it, renamed the package.json and published to add support for scrollElement since our scrollable container is further outside
import InfiniteList from 'src/components/infiniteScroll';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import { connect } from 'react-redux';
import InboxThread from 'src/components/inboxThread';
import { NullCard } from 'src/components/upsell';
import { Loading, LoadingInboxThread } from 'src/components/loading';
import NewActivityIndicator from 'src/components/newActivityIndicator';
import ViewError from 'src/components/viewError';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import type { Dispatch } from 'redux';
import { ErrorBoundary } from 'src/components/error';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { useConnectionRestored } from 'src/hooks/useConnectionRestored';
import type { WebsocketConnectionType } from 'src/reducers/connectionStatus';
import getComposerLink from 'src/helpers/get-composer-link';
import { OutlineButton } from 'src/views/community/components/button';
import Icon from 'src/components/icons';

const NullState = ({ viewContext, isSearch, communityId, channelId }) => {
  let hd;
  let cp;

  if (viewContext && viewContext === 'communityProfile') {
    hd = 'Start a conversation';
    cp = 'Ask a question, share a tip, or anything else that’s on your mind.';
  }

  if (viewContext && viewContext === 'channelProfile') {
    hd = 'There’s nothing in this channel yet';
    cp = 'But you could be the first person to post something here!';
  }

  if (viewContext && viewContext === 'userProfile') {
    hd = 'This user hasn’t posted yet';
    cp = 'But you could message them!';
  }

  if (isSearch) {
    hd = 'We didn’t find any relevant posts...';
    cp = 'Try searching again or create a new post';
  }

  const { pathname, search } = getComposerLink({ communityId, channelId });
  const headingIcon = (communityId || channelId) && (
    <Icon glyph={'post'} size={44} />
  );
  return (
    <NullCard headingIcon={headingIcon} bg="post" heading={hd} copy={cp}>
      {(communityId || channelId) && (
        <OutlineButton to={{ pathname, search, state: { modal: true } }}>
          <Icon glyph={'post'} size={24} />
          New post
        </OutlineButton>
      )}
    </NullCard>
  );
};

const Threads = styled.div`
  display: flex;
  flex: none;
  flex-direction: column;
  align-self: stretch;
  align-items: stretch;

  > div {
    display: flex;
    flex: none;
    flex-direction: column;
    align-self: stretch;
    align-items: stretch;
  }
`;

type Props = {
  data: {
    subscribeToUpdatedThreads: Function,
    fetchMore: Function,
    networkStatus: number,
    hasNextPage: boolean,
    error: ?Object,
    community?: any,
    channel?: any,
    threads?: Array<any>,
    refetch: Function,
  },
  community: GetCommunityType,
  hasThreads: Function,
  hasNoThreads: Function,
  currentUser: ?Object,
  viewContext?:
    | ?'communityInbox'
    | 'communityProfile'
    | 'channelInbox'
    | 'channelProfile'
    | 'userProfile',
  slug: string,
  pinnedThreadId: ?string,
  newActivityIndicator: ?boolean,
  dispatch: Dispatch<Object>,
  search?: boolean,
  networkOnline: boolean,
  websocketConnection: WebsocketConnectionType,
};

type State = {
  scrollElement: any,
  subscription: ?Function,
};

class ThreadFeedPure extends React.Component<Props, State> {
  state = {
    scrollElement: null,
    subscription: null,
  };

  subscribe = () => {
    this.setState({
      subscription:
        this.props.data.subscribeToUpdatedThreads &&
        this.props.data.subscribeToUpdatedThreads(),
    });
  };

  unsubscribe = () => {
    const { subscription } = this.state;
    if (subscription) {
      // This unsubscribes the subscription
      subscription();
    }
  };

  shouldComponentUpdate(nextProps: Props) {
    const curr = this.props;
    if (curr.networkOnline !== nextProps.networkOnline) return true;
    if (curr.websocketConnection !== nextProps.websocketConnection) return true;
    // fetching more
    if (curr.data.networkStatus === 7 && nextProps.data.networkStatus === 3)
      return false;
    return true;
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentDidMount() {
    const scrollElement = document.getElementById('scroller-for-thread-feed');

    this.setState({
      // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
      // the AppViewWrapper which is the scrolling part of the site.
      scrollElement,
    });

    this.subscribe();
  }

  componentDidUpdate(prev: Props) {
    const curr = this.props;

    const didReconnect = useConnectionRestored({ curr, prev });
    if (didReconnect && curr.data.refetch) {
      curr.data.refetch();
    }

    if (
      !prev.data.thread &&
      curr.data.threads &&
      curr.data.threads.length === 0
    ) {
      if (curr.hasThreads) {
        curr.hasThreads();
      }

      if (curr.hasNoThreads) {
        curr.hasNoThreads();
      }
    }
  }

  render() {
    const {
      data: { threads, networkStatus, error },
      viewContext,
      newActivityIndicator,
    } = this.props;

    const { scrollElement } = this.state;
    const dataExists = threads && threads.length > 0;

    const threadNodes =
      threads && threads.length > 0
        ? threads
            .slice()
            .map(thread => thread.node)
            .filter(
              thread =>
                !thread.channel.channelPermissions.isBlocked &&
                !thread.community.communityPermissions.isBlocked
            )
        : [];

    let filteredThreads = threadNodes;
    if (
      this.props.data.community &&
      this.props.data.community.watercooler &&
      this.props.data.community.watercooler.id
    ) {
      filteredThreads = filteredThreads.filter(
        // $FlowIssue
        t => t.id !== this.props.data.community.watercooler.id
      );
    }
    if (
      this.props.data.community &&
      this.props.data.community.pinnedThread &&
      this.props.data.community.pinnedThread.id
    ) {
      filteredThreads = filteredThreads.filter(
        // $FlowIssue
        t => t.id !== this.props.data.community.pinnedThread.id
      );
    }

    const uniqueThreads = deduplicateChildren(filteredThreads, 'id');

    if (dataExists) {
      return (
        <Threads data-cy="thread-feed">
          {newActivityIndicator && (
            <NewActivityIndicator elem="scroller-for-thread-feed" />
          )}

          {(networkStatus === 2 || networkStatus === 1) && (
            <div style={{ padding: '16px 32px' }}>
              <Loading />
            </div>
          )}

          {this.props.data.community &&
            this.props.data.community.pinnedThread &&
            this.props.data.community.pinnedThread.id && (
              <ErrorBoundary fallbackComponent={null}>
                <InboxThread
                  data={this.props.data.community.pinnedThread}
                  viewContext={viewContext}
                  pinnedThreadId={this.props.data.community.pinnedThread.id}
                />
              </ErrorBoundary>
            )}

          <InfiniteList
            pageStart={0}
            loadMore={this.props.data.fetchMore}
            isLoadingMore={this.props.data.networkStatus === 3}
            hasMore={this.props.data.hasNextPage}
            loader={<LoadingInboxThread />}
            useWindow={false}
            initialLoad={false}
            scrollElement={scrollElement}
            threshold={750}
            className={'threadfeed-infinite-scroll-div'}
          >
            {uniqueThreads.map(thread => {
              return (
                <ErrorBoundary fallbackComponent={null} key={thread.id}>
                  <InboxThread data={thread} viewContext={viewContext} />
                </ErrorBoundary>
              );
            })}
          </InfiniteList>
        </Threads>
      );
    }

    if (networkStatus === 2 || networkStatus === 1) {
      return (
        <Threads>
          <LoadingInboxThread />
          <LoadingInboxThread />
          <LoadingInboxThread />
          <LoadingInboxThread />
          <LoadingInboxThread />
          <LoadingInboxThread />
          <LoadingInboxThread />
          <LoadingInboxThread />
          <LoadingInboxThread />
          <LoadingInboxThread />
        </Threads>
      );
    }

    if (networkStatus === 8 || error) {
      return (
        <ViewError
          heading={'We ran into an issue loading the feed'}
          subheading={
            'Try refreshing the page below. If you’re still seeing this error, you can email us at hi@spectrum.chat.'
          }
          refresh
        />
      );
    }

    const nullComposerCommunityId = this.props.data.community
      ? this.props.data.community.id
      : this.props.data.channel
      ? this.props.data.channel.community.id
      : null;

    return (
      <NullState
        communityId={nullComposerCommunityId}
        channelId={this.props.data.channel && this.props.data.channel.id}
        isSearch={this.props.search}
        viewContext={viewContext}
      />
    );
  }
}

const map = state => ({
  newActivityIndicator: state.newActivityIndicator.hasNew,
  networkOnline: state.connectionStatus.networkOnline,
  websocketConnection: state.connectionStatus.websocketConnection,
});
const ThreadFeed = compose(
  // $FlowIssue
  connect(map),
  withCurrentUser
)(ThreadFeedPure);

export default ThreadFeed;
