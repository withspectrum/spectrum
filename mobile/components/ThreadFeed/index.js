// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { View } from 'react-native';
import Text from '../Text';
import ViewNetworkHandler from '../ViewNetworkHandler';
import ThreadItem from '../ThreadItem';
import InfiniteList from '../InfiniteList';
import Loading from '../Loading';
import type { ThreadConnectionType } from '../../../shared/graphql/fragments/community/communityThreadConnection';

/*
  The thread feed always expects a prop of 'threads' - this means that in
  the Apollo query contructor, you will need to map a new prop called 'threads'
  to return whatever threads we're fetching (community -> threadsConnection)

  See 'gql/community/communityThreads.js' for an example of the prop mapping in action
*/

import { CenteredView } from './style';

type State = {
  subscription: ?Function,
};

type Props = {
  isLoading: boolean,
  isFetchingMore: boolean,
  isRefetching: boolean,
  hasError: boolean,
  navigation: Object,
  // This is necessary so we can listen to updates
  channels?: string[],
  data: {
    subscribeToUpdatedThreads: Function,
    fetchMore: () => Promise<any>,
    threadConnection: ThreadConnectionType,
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
      threadConnection.pageInfo.hasNextPage
    ) {
      fetchMore();
    }
  };

  render() {
    const {
      data: { threadConnection },
      isLoading,
      hasError,
      navigation,
    } = this.props;

    if (isLoading) {
      return <Loading />;
    }

    if (threadConnection && threadConnection.edges.length > 0) {
      return (
        <View data-cy="thread-feed" style={{ flex: 1 }}>
          <InfiniteList
            data={threadConnection.edges}
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

    if (hasError) {
      return (
        <CenteredView>
          <Text type="body">Error!</Text>
        </CenteredView>
      );
    }

    return (
      <CenteredView>
        <Text type="body">Nothing here yet!</Text>
      </CenteredView>
    );
  }
}

export default compose(ViewNetworkHandler)(ThreadFeed);
