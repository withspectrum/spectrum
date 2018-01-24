// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import getCurrentUserDirectMessageThreads from 'shared/graphql/queries/directMessageThread/getCurrentUserDMThreadConnection';
import { markDirectMessageNotificationsSeenMutation } from '../../api/notification';
import Icon from '../../components/icons';
import ThreadsList from './components/threadsList';
import NewThread from './containers/newThread';
import ExistingThread from './containers/existingThread';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import ViewError from '../../components/viewError';
import { LoadingDM } from '../../components/loading';
import Titlebar from '../titlebar';
import { View, MessagesList, ComposeHeader } from './style';

type Props = {
  subscribeToUpdatedDirectMessageThreads: Function,
  markDirectMessageNotificationsSeen: Function,
  dispatch: Function,
  match: Object,
  currentUser?: Object,
  hasError: boolean,
  fetchMore: Function,
  data: {
    user: {
      directMessageThreadsConnection: {
        pageInfo: {
          hasNextPage: boolean,
        },
        edges: Array<Object>,
      },
    },
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

  shouldComponentUpdate(nextProps) {
    const curr = this.props;
    // fetching more
    if (curr.data.networkStatus === 7 && nextProps.data.networkStatus === 3)
      return false;
    return true;
  }

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
    const { match, currentUser, data, hasError, fetchMore } = this.props;
    console.log('data', data);

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
            .map(thread => thread.node)
            .sort((a, b) => {
              const x = new Date(a.threadLastActive).getTime();
              const y = new Date(b.threadLastActive).getTime();
              const val = y - x;
              return val;
            })
        : null;

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
          backRoute={`/messages`}
          noComposer={isComposing || isViewingThread}
          messageComposer={!isComposing && !isViewingThread}
        />
        <MessagesList isViewingThread={isViewingThread || isComposing}>
          <Link to="/messages/new" onClick={() => this.setActiveThread('new')}>
            <ComposeHeader>
              <Icon glyph="message-new" />
            </ComposeHeader>
          </Link>

          {dataExists ? (
            <ThreadsList
              hasNextPage={hasNextPage}
              fetchMore={fetchMore}
              active={activeThread}
              threads={threads}
              currentUser={currentUser}
            />
          ) : (
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
          )}
        </MessagesList>

        {dataExists && (
          <ThreadDetail
            match={match}
            currentUser={currentUser}
            setActiveThread={this.setActiveThread}
            hideOnMobile={!(isComposing || isViewingThread)}
            id={match.params.threadId && match.params.threadId}
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
