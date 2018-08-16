// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import getCurrentUserDirectMessageThreads from 'shared/graphql/queries/directMessageThread/getCurrentUserDMThreadConnection';
import type { GetCurrentUserDMThreadConnectionType } from 'shared/graphql/queries/directMessageThread/getCurrentUserDMThreadConnection';
import markDirectMessageNotificationsSeenMutation from 'shared/graphql/mutations/notification/markDirectMessageNotificationsSeen';
import Icon from 'src/components/icons';
import ThreadsList from '../components/threadsList';
import NewThread from './newThread';
import ExistingThread from './existingThread';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import ViewError from '../../../components/viewError';
import Titlebar from '../../titlebar';
import {
  View,
  MessagesList,
  ComposeHeader,
  TabsContainer,
  TabsLink,
  NewMessageLink,
} from '../style';
import { track, events } from 'src/helpers/analytics';
import type { Dispatch } from 'redux';

type Props = {
  subscribeToUpdatedDirectMessageThreads: Function,
  markDirectMessageNotificationsSeen: Function,
  dispatch: Dispatch<Object>,
  match: Object,
  currentUser?: Object,
  hasError: boolean,
  isFetchingMore: boolean,
  isLoading: boolean,
  fetchMore: Function,
  data: {
    user: GetCurrentUserDMThreadConnectionType,
  },
};
type State = {
  activeThread: string,
  activeTab: 'archived' | 'active',
  subscription: ?Function,
};

class DirectMessagesContents extends React.Component<{
  archivedThreads: boolean,
  data: {
    user: GetCurrentUserDMThreadConnectionType,
  },
}> {
  state = {
    subscription: null,
  };
  subscribe = () => {
    this.setState({
      subscription: this.props.subscribeToUpdatedDirectMessageThreads(),
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
    this.props.markDirectMessageNotificationsSeen();
    this.subscribe();
    track(events.DIRECT_MESSAGES_VIEWED);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const {
      match,
      currentUser,
      data,
      hasError,
      fetchMore,
      isFetchingMore,
      isLoading,
      archivedThreads,
    } = this.props;

    const isComposing = match.url === '/messages/new' && match.isExact;
    const isViewingThread = !!match.params.threadId;
    const ThreadDetail = isViewingThread ? ExistingThread : NewThread;
    const dataExists =
      currentUser && data.user && data.user.directMessageThreadsConnection;
    const threads =
      dataExists &&
      data.user.directMessageThreadsConnection.edges &&
      data.user.directMessageThreadsConnection.edges.length > 0
        ? data.user.directMessageThreadsConnection.edges
            .map(thread => thread && thread.node)
            .filter(thread => {
              if (!thread.archivedAt && !archivedThreads) return true;
              if (thread.archivedAt && archivedThreads) return true;
              return false;
            })
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

    if (hasError) return <ViewError />;

    const hasNextPage =
      data.user &&
      data.user.directMessageThreadsConnection &&
      data.user.directMessageThreadsConnection.pageInfo &&
      data.user.directMessageThreadsConnection.pageInfo.hasNextPage;

    const isInActiveMessages = !this.props.archivedThreads;
    const isInArchivedMessages = this.props.archivedThreads;

    return (
      <React.Fragment>
        <MessagesList isViewingThread={isViewingThread || isComposing}>
          <ComposeHeader>
            <TabsContainer>
              <TabsLink
                onClick={this.props.showActive}
                isActive={isInActiveMessages}
              >
                Inbox
              </TabsLink>
              <TabsLink
                onClick={this.props.showArchived}
                isActive={isInArchivedMessages}
              >
                Archived
              </TabsLink>
            </TabsContainer>
            <NewMessageLink
              to="/messages/new"
              onClick={() => this.props.setActiveThread('new')}
            >
              <Icon glyph="message-new" />
            </NewMessageLink>
          </ComposeHeader>

          <ThreadsList
            hasNextPage={hasNextPage}
            fetchMore={fetchMore}
            active={this.props.activeThread}
            threads={threads}
            currentUser={currentUser}
            isFetchingMore={isFetchingMore}
            isLoading={isLoading}
            activeTab={this.props.activeTab}
          />
        </MessagesList>

        {dataExists && (
          <ThreadDetail
            match={match}
            currentUser={currentUser}
            setActiveThread={this.props.setActiveThread}
            hideOnMobile={!(isComposing || isViewingThread)}
            id={match.params.threadId && match.params.threadId}
            threads={threads}
          />
        )}
      </React.Fragment>
    );
  }
}

const DirectMessagesContentsWithFetch = compose(
  getCurrentUserDirectMessageThreads,
  viewNetworkHandler
)(DirectMessagesContents);

class DirectMessages extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      activeThread: '',
      activeTab: 'active',
      subscription: null,
    };
  }

  setActiveThread = id => {
    if (id === 'new') {
      track(events.DIRECT_MESSAGE_THREAD_COMPOSER_VIEWED);
    } else {
      track(events.DIRECT_MESSAGE_THREAD_VIEWED);
    }

    return this.setState({
      activeThread: id === 'new' ? '' : id,
    });
  };

  showActive = () => {
    this.setState({
      activeTab: 'active',
    });
  };

  showArchived = () => {
    this.setState({
      activeTab: 'archived',
    });
  };

  render() {
    const { match, currentUser } = this.props;

    if (!currentUser) return null;

    const { activeThread, activeTab } = this.state;
    const isComposing = match.url === '/messages/new' && match.isExact;
    const isViewingThread = !!match.params.threadId;

    return (
      <View>
        <Titlebar
          title={isComposing ? 'New Message' : 'Messages'}
          provideBack={isComposing || isViewingThread}
          backRoute={'/messages'}
          noComposer={isComposing || isViewingThread}
          messageComposer={!isComposing && !isViewingThread}
        />
        <DirectMessagesContentsWithFetch
          {...this.props}
          archivedThreads={activeTab === 'archived'}
          showActive={this.showActive}
          showArchived={this.showArchived}
          setActiveThread={this.setActiveThread}
          activeThread={activeThread}
        />
      </View>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(
  // $FlowIssue
  connect(map),
  markDirectMessageNotificationsSeenMutation
)(DirectMessages);
