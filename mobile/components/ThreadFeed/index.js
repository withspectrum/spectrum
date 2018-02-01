// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { View, Text, FlatList } from 'react-native';
import ViewNetworkHandler from '../ViewNetworkHandler';
import ThreadItem from '../ThreadItem';
import InfiniteList from '../InfiniteList';
import type { GetCommunityThreadConnectionType } from '../../../shared/graphql/queries/community/getCommunityThreadConnection';
import type { ThreadConnectionType } from '../../../shared/graphql/fragments/community/communityThreadConnection';

/*
  The thread feed always expects a prop of 'threads' - this means that in
  the Apollo query contructor, you will need to map a new prop called 'threads'
  to return whatever threads we're fetching (community -> threadsConnection)

  See 'gql/community/communityThreads.js' for an example of the prop mapping in action
*/

type State = {
  subscription: ?Function,
};

type Props = {
  isLoading: boolean,
  isFetchingMore: boolean,
  isRefetching: boolean,
  hasError: boolean,
  navigation: Object,
  data: {
    subscribeToUpdatedThreads: Function,
    fetchMore: Function,
    threadConnection: ThreadConnectionType,
    community?: GetCommunityThreadConnectionType,
  },
};

class ThreadFeed extends React.Component<Props, State> {
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
      threadConnection.pageInfo.hasNextPage
    ) {
      console.log('actually fetch more!');
      fetchMore();
    }
  };

  render() {
    const {
      data: { threadConnection, community },
      isLoading,
      isFetchingMore,
      hasError,
      navigation,
    } = this.props;

    const hasThreads = threadConnection && threadConnection.edges.length > 0;

    let filteredThreads = hasThreads ? threadConnection.edges : [];

    const hasWatercooler =
      community && community.watercooler && community.watercooler.id;

    const hasPinnedThread =
      community && community.pinnedThread && community.pinnedThread.id;

    // pull out the watercooler
    if (hasWatercooler) {
      filteredThreads = filteredThreads.filter(
        t =>
          community &&
          community.watercooler &&
          t &&
          t.node.id !== community.watercooler.id
      );
    }

    // pull out the pinned thread
    if (hasPinnedThread) {
      filteredThreads = filteredThreads.filter(
        t =>
          community &&
          community.pinnedThread &&
          t &&
          t.node.id !== community.pinnedThread.id
      );
    }

    if (hasThreads) {
      return (
        <View data-e2e-id="thread-feed">
          {/*hasPinnedThread && (
              <ThreadFeedCard
                data={this.props.data.community.pinnedThread}
                viewContext={viewContext}
                isPinned={true}
              />
            )*/}

          {/*hasWatercooler && (
              <ThreadFeedCard
                data={this.props.data.community.watercooler}
                viewContext={viewContext}
              />
            )*/}

          <InfiniteList
            data={filteredThreads}
            renderItem={({ item }) => (
              <ThreadItem navigation={navigation} thread={item.node} />
            )}
            loadingIndicator={<Text>Loading...</Text>}
            fetchMore={this.fetchMore}
            hasNextPage={threadConnection.pageInfo.hasNextPage}
          />
        </View>
      );
    }

    if (isLoading) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }

    if (hasError) {
      return (
        <View>
          <Text>Error!</Text>
        </View>
      );
    }

    return null;
  }
}

export default compose(ViewNetworkHandler)(ThreadFeed);
