// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import DirectMessageListItem from './messageThreadListItem';
import getCurrentUserDMThreadConnection, {
  type GetCurrentUserDMThreadConnectionType,
} from 'shared/graphql/queries/directMessageThread/getCurrentUserDMThreadConnection';
import InfiniteList from 'src/components/infiniteScroll';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import { LoadingDM } from 'src/components/loading';
import { ThreadsListScrollContainer } from './style';
import { track, events } from 'src/helpers/analytics';
import { ErrorBoundary } from 'src/components/error';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { useConnectionRestored } from 'src/hooks/useConnectionRestored';
import type { WebsocketConnectionType } from 'src/reducers/connectionStatus';
import type { Query } from 'react-apollo';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import { DesktopTitlebar } from 'src/components/titlebar';
import {
  PrimaryButton,
  SmallPrimaryButton,
} from 'src/views/community/components/button';
import {
  NoCommunitySelected,
  NoCommunityHeading,
  NoCommunitySubheading,
} from '../style';

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
    const { dmData, activeThreadId } = this.props;
    // don't accidentally paginate the threadslist in the background on mobile
    if (window && window.innerWidth < 768 && activeThreadId) return;
    return dmData.fetchMore();
  };

  render() {
    const { currentUser, dmData, activeThreadId } = this.props;
    const { scrollElement } = this.state;

    if (!dmData) return null;

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

    if (!dmDataExists && dmData.loading) {
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
        <ThreadsListScrollContainer>
          <DesktopTitlebar title={'Messages'} />
          <NoCommunitySelected hideOnDesktop>
            <div>
              <NoCommunityHeading>No conversation selected</NoCommunityHeading>
              <NoCommunitySubheading>
                Choose from an existing conversation, or start a new one.
              </NoCommunitySubheading>
              <PrimaryButton
                to={{
                  pathname: '/new/message',
                  state: { modal: true },
                }}
              >
                New message
              </PrimaryButton>
            </div>
          </NoCommunitySelected>
        </ThreadsListScrollContainer>
      );
    }

    return (
      <React.Fragment>
        <DesktopTitlebar
          title={'Messages'}
          rightAction={
            <SmallPrimaryButton
              to={{ pathname: '/new/message', state: { modal: true } }}
            >
              New
            </SmallPrimaryButton>
          }
        />
        <ThreadsListScrollContainer id={'scroller-for-dm-threads'}>
          <InfiniteList
            loadMore={this.paginate}
            hasMore={hasNextPage}
            loader={<LoadingDM key={0} />}
            getScrollParent={() => scrollElement}
          >
            {uniqueThreads.map(thread => {
              if (!thread) return null;
              return (
                <ErrorBoundary key={thread.id}>
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
      </React.Fragment>
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
