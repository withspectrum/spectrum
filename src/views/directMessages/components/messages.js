// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { sortAndGroupMessages } from 'shared/clients/group-messages';
import ChatMessages from 'src/components/messageGroup';
import { Loading } from 'src/components/loading';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import NextPageButton from 'src/components/nextPageButton';
import getDirectMessageThreadMessages from 'shared/graphql/queries/directMessageThread/getDirectMessageThreadMessageConnection';
import type { GetDirectMessageThreadMessageConnectionType } from 'shared/graphql/queries/directMessageThread/getDirectMessageThreadMessageConnection';
import setLastSeenMutation from 'shared/graphql/mutations/directMessageThread/setDMThreadLastSeen';
import { MessagesScrollWrapper } from './style';
import { ErrorBoundary } from 'src/components/error';

type Props = {
  id: string,
  data: {
    loading: boolean,
    directMessageThread: GetDirectMessageThreadMessageConnectionType,
    messages: Array<Object>,
    hasNextPage: boolean,
    fetchMore: Function,
  },
  subscribeToNewMessages: Function,
  isLoading: boolean,
  hasError: boolean,
  isFetchingMore: boolean,
  setLastSeen: Function,
};

type State = {
  subscription: ?Function,
};

class MessagesWithData extends React.Component<Props, State> {
  subscription: ?Function;

  componentDidMount() {
    this.subscribe();

    const thread = this.props.data.directMessageThread;
    // Scroll to bottom on mount if we got cached data as getSnapshotBeforeUpdate does not fire for mounts
    if (thread) {
      const elem = document.getElementById('main');
      if (!elem) return;
      elem.scrollTop = elem.scrollHeight;
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  subscribe = () => {
    this.subscription = this.props.subscribeToNewMessages();
  };

  unsubscribe = () => {
    if (this.subscription) this.subscription();
  };

  getSnapshotBeforeUpdate(prev) {
    const curr = this.props;
    // First load
    if (
      !prev.data.directMessageThread &&
      curr.data.directMessageThread &&
      curr.data.directMessageThread.messageConnection.edges.length > 0
    ) {
      return {
        type: 'bottom',
      };
    }

    // New messages
    if (
      prev.data.directMessageThread &&
      curr.data.directMessageThread &&
      prev.data.directMessageThread.messageConnection.edges.length <
        curr.data.directMessageThread.messageConnection.edges.length
    ) {
      const elem = document.getElementById('main');
      if (!elem) return null;

      // If we are near the bottom when new messages come in, stick to the bottom
      if (elem.scrollHeight < elem.scrollTop + elem.clientHeight + 400) {
        return {
          type: 'bottom',
        };
      }

      const prevEdges = prev.data.directMessageThread.messageConnection.edges.filter(
        Boolean
      );
      const currEdges = curr.data.directMessageThread.messageConnection.edges.filter(
        Boolean
      );
      // If messages were added at the end, keep the scroll position the same
      if (
        currEdges[currEdges.length - 1].node.id ===
        prevEdges[prevEdges.length - 1].node.id
      ) {
        return null;
      }

      // If messages were added at the top, persist the scroll position
      return {
        type: 'persist',
        values: {
          top: elem.scrollTop,
          height: elem.scrollHeight,
        },
      };
    }
    return null;
  }

  componentDidUpdate(prev, _, snapshot) {
    const { data, setLastSeen } = this.props;

    if (snapshot) {
      const elem = document.getElementById('main');
      if (elem) {
        switch (snapshot.type) {
          case 'bottom': {
            elem.scrollTop = elem.scrollHeight;
            break;
          }
          case 'persist': {
            elem.scrollTop =
              elem.scrollHeight - snapshot.values.height + snapshot.values.top;
            break;
          }
          default: {
            break;
          }
        }
      }
    }

    const firstLoad =
      !prev.data.directMessageThread && data.directMessageThread;
    const newThread =
      prev.data.directMessageThread &&
      data.directMessageThread &&
      prev.data.directMessageThread.id !== data.directMessageThread.id;

    if (firstLoad) {
      this.subscribe();
      setLastSeen(data.directMessageThread.id);
    } else if (newThread) {
      this.unsubscribe();
      this.subscribe();
      setLastSeen(data.directMessageThread.id);
    }
  }

  render() {
    const {
      data: { messages, directMessageThread, hasNextPage, fetchMore },
      hasError,
      isLoading,
      isFetchingMore,
    } = this.props;

    if (hasError) {
      return <div>Error!</div>;
    }

    // NOTE(@mxstbr): The networkStatus check shouldn't be there, but if I remove
    // it the loading indicator doesn't show when switching between threads which
    // is hella annoying as the old msgs stick around until the new ones are there.
    // TODO: FIXME and remove the networkStatus === 7
    if (isFetchingMore || (messages && messages.length > 0)) {
      let unsortedMessages = messages.map(message => message.node);

      const unique = array => {
        const processed = [];
        for (let i = array.length - 1; i >= 0; i--) {
          if (processed.indexOf(array[i].id) < 0) {
            processed.push(array[i].id);
          } else {
            array.splice(i, 1);
          }
        }
        return array;
      };

      const uniqueMessages = unique(unsortedMessages);
      const sortedMessages = sortAndGroupMessages(uniqueMessages);

      return (
        <MessagesScrollWrapper>
          <ErrorBoundary>
            {hasNextPage && (
              <NextPageButton
                isFetchingMore={isFetchingMore}
                fetchMore={fetchMore}
              />
            )}
            <ChatMessages
              messages={sortedMessages}
              uniqueMessageCount={uniqueMessages.length}
              threadType={'directMessageThread'}
              thread={directMessageThread}
            />
          </ErrorBoundary>
        </MessagesScrollWrapper>
      );
    }

    if (isLoading) {
      return (
        <MessagesScrollWrapper>
          <Loading style={{ padding: '64px 0' }} />
        </MessagesScrollWrapper>
      );
    }

    return null;
  }
}

const Messages = compose(
  setLastSeenMutation,
  getDirectMessageThreadMessages,
  viewNetworkHandler
)(MessagesWithData);

export default Messages;
