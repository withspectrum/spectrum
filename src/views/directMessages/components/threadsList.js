// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import VisibilitySensor from 'react-visibility-sensor';
import DirectMessageListItem from './messageThreadListItem';
import getCurrentUserDMThreadConnection, {
  type GetCurrentUserDMThreadConnectionType,
} from 'shared/graphql/queries/directMessageThread/getCurrentUserDMThreadConnection';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import { LoadingDM } from 'src/components/loading';
import { ThreadsListScrollContainer } from './style';
import { ErrorBoundary } from 'src/components/error';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { useConnectionRestored } from 'src/hooks/useConnectionRestored';
import type { WebsocketConnectionType } from 'src/reducers/connectionStatus';
import type { Query } from 'react-apollo';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import { DesktopTitlebar } from 'src/components/titlebar';
import { PrimaryOutlineButton } from 'src/components/button';
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
  subscription: ?Function,
};

class ThreadsList extends React.Component<Props, State> {
  state = {
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
    this.subscribe();
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

  onLoadMoreVisible = (isVisible: boolean) => {
    if (this.props.isFetchingMore || !isVisible) return;
    return this.paginate();
  };

  render() {
    const { currentUser, dmData, activeThreadId, isFetchingMore } = this.props;

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
        <ThreadsListScrollContainer>
          <DesktopTitlebar title={'Messages'} />
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
        </ThreadsListScrollContainer>
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
              <PrimaryOutlineButton
                to={{
                  pathname: '/new/message',
                  state: { modal: true },
                }}
              >
                New message
              </PrimaryOutlineButton>
            </div>
          </NoCommunitySelected>
        </ThreadsListScrollContainer>
      );
    }

    const LoadingDMWithVisibility = () => (
      <VisibilitySensor
        active={!isFetchingMore}
        delayedCall
        partialVisibility
        scrollCheck
        intervalDelay={250}
        onChange={this.onLoadMoreVisible}
        offset={{
          bottom: -250,
        }}
      >
        <LoadingDM key={0} />
      </VisibilitySensor>
    );

    return (
      <React.Fragment>
        <DesktopTitlebar
          title={'Messages'}
          rightAction={
            <PrimaryOutlineButton
              data-cy="compose-dm"
              size={'small'}
              to={{ pathname: '/new/message', state: { modal: true } }}
            >
              New
            </PrimaryOutlineButton>
          }
        />
        <ThreadsListScrollContainer>
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
          {hasNextPage && <LoadingDMWithVisibility />}
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
