// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import DirectMessageListItem from './messageThreadListItem';
import getCurrentUserDMThreadConnection, {
  type GetCurrentUserDMThreadConnectionType,
} from 'shared/graphql/queries/directMessageThread/getCurrentUserDMThreadConnection';
import InfiniteList from 'src/components/infiniteScroll';
import { NullState } from 'src/components/upsell';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import { LoadingDM } from 'src/components/loading';
import { ThreadsListScrollContainer } from './style';
import { NoThreads } from '../style';
import { track, events } from 'src/helpers/analytics';
import { ErrorBoundary } from 'src/components/error';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { useConnectionRestored } from 'src/hooks/useConnectionRestored';
import type { WebsocketConnectionType } from 'src/reducers/connectionStatus';
import type { Query } from 'react-apollo';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';

type Props = {
  currentUser: Object,
  subscribeToUpdatedDirectMessageThreads: Function,
  networkOnline: boolean,
  websocketConnection: WebsocketConnectionType,
  activeThreadId: ?string,
  ...$Exact<ViewNetworkHandlerType>,
  dmData: {
    ...$Exact<Query>,
    user: {
      ...$Exact<GetCurrentUserDMThreadConnectionType>,
    },
  },
};

type State = {
  scrollElement: any,
  subscription: ?Function,
};

class ThreadsList extends React.Component<Props, State> {
  state = {
    scrollElement: null,
    subscription: null,
  };

  subscribe = () => {
    this.setState({
      subscription: this.props.dmData.subscribeToUpdatedDirectMessageThreads(),
    });
  };

  unsubscribe = () => {
    const { subscription } = this.state;
    if (subscription) {
      // This unsubscribes the subscription
      subscription();
    }
  };

  componentDidMount() {
    const scrollElement = document.getElementById('scroller-for-dm-threads');
    this.setState({
      // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
      // the AppViewWrapper which is the scrolling part of the site.
      scrollElement,
    });

    this.subscribe();
    track(events.DIRECT_MESSAGES_VIEWED);
  }

  componentDidUpdate(prev: Props) {
    const curr = this.props;

    const didReconnect = useConnectionRestored({ curr, prev });
    if (didReconnect && curr.dmData.refetch) {
      curr.dmData.refetch();
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  shouldComponentUpdate(nextProps) {
    const curr = this.props;
    // fetching more
    if (curr.dmData.networkStatus === 7 && nextProps.dmData.networkStatus === 3)
      return false;
    return true;
  }

  paginate = () => {
    const { dmData, isFetchingMore, activeThreadId } = this.props;
    // don't accidentally paginate the threadslist in the background on mobile
    if (window && window.innerWidth < 768 && activeThreadId) return;
    return dmData.fetchMore();
  };

  render() {
    const { currentUser, dmData, activeThreadId } = this.props;
    const { scrollElement } = this.state;

    if (!dmData || !dmData.user) return null;

    const dmDataExists =
      currentUser && dmData.user && dmData.user.directMessageThreadsConnection;
    const threads =
      dmDataExists &&
      dmData.user.directMessageThreadsConnection.edges &&
      dmData.user.directMessageThreadsConnection.edges.length > 0
        ? dmData.user.directMessageThreadsConnection.edges
            .map(thread => thread && thread.node)
            .sort((a, b) => {
              const x =
                a &&
                a.threadLastActive &&
                new Date(a.threadLastActive).getTime();
              const y =
                b &&
                b.threadLastActive &&
                new Date(b.threadLastActive).getTime();
              const val = parseInt(y, 10) - parseInt(x, 10);
              return val;
            })
        : [];

    const hasNextPage =
      dmData.user &&
      dmData.user.directMessageThreadsConnection &&
      dmData.user.directMessageThreadsConnection.pageInfo &&
      dmData.user.directMessageThreadsConnection.pageInfo.hasNextPage;

    const uniqueThreads = deduplicateChildren(threads, 'id');

    if (!dmDataExists && dmData.isLoading) {
      return (
        <div>
          <LoadingDM />
          <LoadingDM />
          <LoadingDM />
          <LoadingDM />
          <LoadingDM />
          <LoadingDM />
          <LoadingDM />
          <LoadingDM />
          <LoadingDM />
          <LoadingDM />
          <LoadingDM />
        </div>
      );
    }

    if (!uniqueThreads || uniqueThreads.length === 0) {
      return (
        <React.Fragment>
          <NoThreads hideOnDesktop>
            <NullState
              icon="message"
              heading={`Send direct messages`}
              copy={`Direct messages are private conversations between you and anyone else, including groups. Search for a person above to start a new conversation.`}
            />
          </NoThreads>
          <NoThreads hideOnMobile>
            <NullState
              heading={`You haven't messaged anyone yet...`}
              copy={`Once you do, your conversations will show up here.`}
            />
          </NoThreads>
        </React.Fragment>
      );
    }

    return (
      <ThreadsListScrollContainer id={'scroller-for-dm-threads'}>
        <InfiniteList
          pageStart={0}
          loadMore={this.paginate}
          isLoadingMore={dmData.networkStatus === 3}
          hasMore={hasNextPage}
          loader={<LoadingDM />}
          useWindow={false}
          scrollElement={scrollElement}
          threshold={100}
          className={'scroller-for-community-dm-threads-list'}
        >
          {uniqueThreads.map(thread => {
            if (!thread) return null;
            return (
              <ErrorBoundary fallbackComponent={null} key={thread.id}>
                <DirectMessageListItem
                  thread={thread}
                  currentUser={currentUser}
                  active={activeThreadId === thread.id}
                />
              </ErrorBoundary>
            );
          })}
        </InfiniteList>
      </ThreadsListScrollContainer>
    );
  }
}

const map = state => ({
  networkOnline: state.connectionStatus.networkOnline,
  websocketConnection: state.connectionStatus.websocketConnection,
});

export default compose(
  withCurrentUser,
  getCurrentUserDMThreadConnection,
  viewNetworkHandler,
  // $FlowIssue
  connect(map)
)(ThreadsList);
