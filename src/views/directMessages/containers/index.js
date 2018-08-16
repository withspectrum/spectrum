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
  subscription: ?Function,
};

class DirectMessages extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      activeThread: '',
      subscription: null,
    };
  }

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

  render() {
    const {
      match,
      currentUser,
      data,
      hasError,
      fetchMore,
      isFetchingMore,
      isLoading,
    } = this.props;

    // Only logged-in users can view DM threads
    if (!currentUser) return null;
    const { activeThread } = this.state;
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

    const isInActiveMessages =
      this.props.match && this.props.match.path === '/messages';
    const isInArchivedMessages =
      this.props.match && this.props.match.path === '/messages/archived';

    return (
      <View>
        <Titlebar
          title={isComposing ? 'New Message' : 'Messages'}
          provideBack={isComposing || isViewingThread}
          backRoute={'/messages'}
          noComposer={isComposing || isViewingThread}
          messageComposer={!isComposing && !isViewingThread}
        />
        <MessagesList isViewingThread={isViewingThread || isComposing}>
          <ComposeHeader>
            <TabsContainer>
              <TabsLink to="/messages" isActive={isInActiveMessages}>
                Inbox
              </TabsLink>
              <TabsLink to="/messages/archived" isActive={isInArchivedMessages}>
                Archived
              </TabsLink>
            </TabsContainer>
            <NewMessageLink
              to="/messages/new"
              onClick={() => this.setActiveThread('new')}
            >
              <Icon glyph="message-new" />
            </NewMessageLink>
          </ComposeHeader>

          <ThreadsList
            hasNextPage={hasNextPage}
            fetchMore={fetchMore}
            active={activeThread}
            threads={threads}
            currentUser={currentUser}
            isFetchingMore={isFetchingMore}
            isLoading={isLoading}
          />
        </MessagesList>

        {dataExists && (
          <ThreadDetail
            match={match}
            currentUser={currentUser}
            setActiveThread={this.setActiveThread}
            hideOnMobile={!(isComposing || isViewingThread)}
            id={match.params.threadId && match.params.threadId}
            threads={threads}
          />
        )}
      </View>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(
  // $FlowIssue
  connect(map),
  getCurrentUserDirectMessageThreads,
  markDirectMessageNotificationsSeenMutation,
  viewNetworkHandler
)(DirectMessages);
