// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { View, Text, FlatList } from 'react-native';
import ViewNetworkHandler from '../ViewNetworkHandler';
import Separator from './Separator';
import ThreadItem from '../ThreadItem';

/*
  The thread feed always expects a prop of 'threads' - this means that in
  the Apollo query contructor, you will need to map a new prop called 'threads'
  to return whatever threads we're fetching (community -> threadsConnection)

  See 'gql/community/communityThreads.js' for an example of the prop mapping in action
*/

type State = {
  subscription: ?Function,
};

type ThreadType = {
  id: string,
};

type Props = {
  isLoading: boolean,
  isFetchingMore: boolean,
  hasError: boolean,
  navigation: Object,
  data: {
    subscribeToUpdatedThreads: Function,
    fetchMore: Function,
    threads: Array<ThreadType>,
    community: {
      communityPermissions: {
        isMember: boolean,
        isOwner: boolean,
        isBlocked: boolean,
      },
      watercooler?: {
        id: string,
      },
      pinnedThread?: {
        id: string,
      },
    },
  },
};

class ThreadFeed extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      subscription: null,
    };
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

  shouldComponentUpdate(nextProps) {
    const curr = this.props;
    // component is fetching more, don't re-render the whole list
    if (!curr.isLoading && nextProps.isFetchingMore) return false;
    return true;
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentDidMount() {
    this.subscribe();
  }

  render() {
    const {
      data: { threads },
      isLoading,
      isFetchingMore,
      hasError,
      navigation,
    } = this.props;

    console.log(this.props);

    const hasThreads = threads && threads.length > 0;

    let filteredThreads = hasThreads ? threads : [];

    const hasWatercooler =
      this.props.data.community &&
      this.props.data.community.watercooler &&
      this.props.data.community.watercooler.id;

    const hasPinnedThread =
      this.props.data.community &&
      this.props.data.community.pinnedThread &&
      this.props.data.community.pinnedThread.id;

    // pull out the watercooler
    if (hasWatercooler) {
      filteredThreads = filteredThreads.filter(
        t => t.id !== this.props.data.community.watercooler.id
      );
    }

    // pull out the pinned thread
    if (hasPinnedThread) {
      filteredThreads = filteredThreads.filter(
        t => t.id !== this.props.data.community.pinnedThread.id
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

          <FlatList
            data={filteredThreads}
            renderItem={({ item }) => (
              <ThreadItem navigation={navigation} thread={item} />
            )}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={Separator}
            onEndReached={() => this.props.data.fetchMore()}
            onEndReachedThreshold={0.5}
            removeClippedSubviews={true}
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
