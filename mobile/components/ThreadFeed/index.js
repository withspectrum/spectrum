// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { View } from 'react-native';
import ViewNetworkHandler from '../ViewNetworkHandler';
import { ThreadListItem, LoadingListItem } from '../Lists';
import InfiniteList from '../InfiniteList';
import Loading from '../Loading';
import type { ThreadConnectionType } from '../../../shared/graphql/fragments/community/communityThreadConnection';
import type { FlatListProps } from 'react-native';
import ErrorBoundary from '../ErrorBoundary';
import { withCurrentUser } from '../WithCurrentUser';
import type { GetUserType } from '../../../shared/graphql/queries/user/getUser';

/*
  The thread feed always expects a prop of 'threads' - this means that in
  the Apollo query contructor, you will need to map a new prop called 'threads'
  to return whatever threads we're fetching (community -> threadsConnection)

  See 'gql/community/communityThreads.js' for an example of the prop mapping in action
*/

import { FullscreenNullState } from '../NullStates';

type State = {
  subscription: ?Function,
};

type Props = {|
  ...$Exact<FlatListProps>,
  isLoading: boolean,
  isFetchingMore: boolean,
  isRefetching: boolean,
  hasError: boolean,
  navigation: Object,
  activeChannel?: string,
  activeCommunity?: string,
  currentUser: GetUserType,
  // This is necessary so we can listen to updates
  channels?: string[],
  noThreadsFallback?: any,
  data: {
    subscribeToUpdatedThreads: Function,
    fetchMore: () => Promise<any>,
    threadConnection: ThreadConnectionType,
  },
|};

class ThreadFeed extends Component<Props, State> {
  constructor() {
    super();
    this.state = {
      subscription: null,
    };
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate(prev) {
    const curr = this.props;
    if (
      !this.state.subscription &&
      JSON.stringify(prev.channels) !== JSON.stringify(curr.channels)
    ) {
      this.subscribe();
    }
  }

  subscribe = () => {
    const { channels } = this.props;
    if (!channels) return;
    this.setState({
      subscription:
        this.props.data.subscribeToUpdatedThreads &&
        this.props.data.subscribeToUpdatedThreads(channels),
    });
  };

  unsubscribe = () => {
    const { subscription } = this.state;
    if (subscription) {
      // This unsubscribes the subscription
      subscription();
    }
  };

  fetchMore = () => {
    const {
      isFetchingMore,
      isLoading,
      hasError,
      isRefetching,
      data: { fetchMore, threadConnection },
    } = this.props;
    if (
      !isFetchingMore &&
      !isLoading &&
      !hasError &&
      !isRefetching &&
      threadConnection &&
      threadConnection.pageInfo &&
      threadConnection.pageInfo.hasNextPage
    ) {
      fetchMore();
    }
  };

  render() {
    const {
      data,
      data: { threadConnection },
      isLoading,
      hasError,
      navigation,
      activeChannel,
      activeCommunity,
      isFetchingMore,
      isRefetching,
      channels,
      currentUser,
      noThreadsFallback: NoThreadsFallback,
      ...flatListProps
    } = this.props;

    if (threadConnection && threadConnection.edges.length > 0) {
      const hasNextPage =
        threadConnection &&
        threadConnection.pageInfo &&
        threadConnection.pageInfo.hasNextPage;
      return (
        <View data-cy="thread-feed" style={{ flex: 1 }}>
          {isRefetching && <LoadingListItem />}

          <InfiniteList
            loadingIndicator={<Loading />}
            fetchMore={this.fetchMore}
            isFetchingMore={this.props.isFetchingMore}
            hasNextPage={hasNextPage}
            isRefetching={this.props.isRefetching}
            refetch={this.props.data.refetch}
            data={threadConnection.edges}
            renderItem={({ item }) => (
              <ErrorBoundary fallbackComponent={null}>
                <ThreadListItem
                  refetch={this.props.data.refetch}
                  thread={item.node}
                  activeChannel={activeChannel}
                  activeCommunity={activeCommunity}
                  currentUser={currentUser}
                  onPressHandler={() =>
                    navigation.navigate({
                      routeName: 'Thread',
                      key: item.node.id,
                      params: { id: item.node.id },
                    })
                  }
                />
              </ErrorBoundary>
            )}
            {...flatListProps}
          />
        </View>
      );
    }

    if (isLoading) {
      return <Loading />;
    }

    if (hasError) {
      return <FullscreenNullState />;
    }

    if (NoThreadsFallback) {
      return <NoThreadsFallback />;
    }

    return (
      <FullscreenNullState
        title={'No threads were found'}
        subtitle={''}
        icon={'thread'}
      />
    );
  }
}

export default compose(withCurrentUser, ViewNetworkHandler)(ThreadFeed);
