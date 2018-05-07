// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import getCurrentUserDirectMessageThreads from 'shared/graphql/queries/directMessageThread/getCurrentUserDMThreadConnection';
import type { GetCurrentUserDMThreadConnectionType } from 'shared/graphql/queries/directMessageThread/getCurrentUserDMThreadConnection';
import markDirectMessageNotificationsSeenMutation from 'shared/graphql/mutations/notification/markDirectMessageNotificationsSeen';
import Icon from '../../../components/icons';
import ThreadsList from '../components/threadsList';
import NewThread from './newThread';
import ExistingThread from './existingThread';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import ViewError from '../../../components/viewError';
import Titlebar from '../../titlebar';
import { View, MessagesList, ComposeHeader } from '../style';

type Props = {
  subscribeToUpdatedDirectMessageThreads: Function,
  markDirectMessageNotificationsSeen: Function,
  dispatch: Function,
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
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  setActiveThread = id => {
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
          <Link to="/messages/new" onClick={() => this.setActiveThread('new')}>
            <ComposeHeader>
              <Icon glyph="message-new" />
            </ComposeHeader>
          </Link>

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
