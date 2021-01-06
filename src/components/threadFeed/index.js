// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import InfiniteList from 'src/components/infiniteScroll';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import { connect } from 'react-redux';
import InboxThread from 'src/components/inboxThread';
import { LoadingInboxThread } from 'src/components/loading';
import ViewError from 'src/components/viewError';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import type { Dispatch } from 'redux';
import { ErrorBoundary } from 'src/components/error';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { useConnectionRestored } from 'src/hooks/useConnectionRestored';
import type { WebsocketConnectionType } from 'src/reducers/connectionStatus';
import { Container } from './style';
import NullState from './nullState';

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
  dispatch: Dispatch<Object>,
  search?: boolean,
  networkOnline: boolean,
  websocketConnection: WebsocketConnectionType,
};

type State = {
  subscription: ?Function,
};

class ThreadFeedPure extends React.Component<Props, State> {
  state = {
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
    } = this.props;

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
    if (
      this.props.data.channel &&
      this.props.data.channel.community &&
      this.props.data.channel.community.watercoolerId
    ) {
      filteredThreads = filteredThreads.filter(
        // $FlowIssue
        t => t.id !== this.props.data.channel.community.watercoolerId
      );
    }

    const uniqueThreads = deduplicateChildren(filteredThreads, 'id');
    if (uniqueThreads && uniqueThreads.length > 0 && networkStatus === 7) {
      return (
        <Container data-cy="thread-feed">
          {this.props.data.community &&
            this.props.data.community.pinnedThread &&
            this.props.data.community.pinnedThread.id && (
              <ErrorBoundary>
                <InboxThread
                  data={this.props.data.community.pinnedThread}
                  viewContext={viewContext}
                  pinnedThreadId={this.props.data.community.pinnedThread.id}
                />
              </ErrorBoundary>
            )}

          <InfiniteList
            loadMore={this.props.data.fetchMore}
            hasMore={this.props.data.hasNextPage}
            loader={<LoadingInboxThread key={0} />}
          >
            {uniqueThreads.map(thread => {
              return (
                <ErrorBoundary key={thread.id}>
                  <InboxThread data={thread} viewContext={viewContext} />
                </ErrorBoundary>
              );
            })}
          </InfiniteList>
        </Container>
      );
    }

    if (networkStatus === 2 || networkStatus === 1) {
      return (
        <Container>
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
        </Container>
      );
    }

    if (networkStatus === 8 || error) {
      return (
        <ViewError
          heading={'We ran into an issue loading the feed'}
          subheading={'Try refreshing the page.'}
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
        isSearch={!!this.props.search}
        viewContext={viewContext}
      />
    );
  }
}

const map = state => ({
  networkOnline: state.connectionStatus.networkOnline,
  websocketConnection: state.connectionStatus.websocketConnection,
});
const ThreadFeed = compose(
  // $FlowIssue
  connect(map),
  withCurrentUser
)(ThreadFeedPure);

export default ThreadFeed;
