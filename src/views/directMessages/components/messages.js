// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { sortAndGroupMessages } from '../../../helpers/messages';
import ChatMessages from '../../../components/messageGroup';
import { Loading } from '../../../components/loading';
import { Spinner } from '../../../components/globals';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import NextPageButton from '../../../components/nextPageButton';
import { getDirectMessageThreadMessages } from '../queries';
import { setLastSeenMutation } from '../../../api/directMessageThread';
import { toggleReactionMutation } from '../mutations';
import { MessagesScrollWrapper } from './style';

type Props = {
  id: string,
  forceScrollToBottom: Function,
  contextualScrollToBottom: Function,
  data: {
    directMessageThread: {
      id: string,
    },
    messages: Array<Object>,
    hasNextPage: boolean,
    fetchMore: Function,
  },
  subscribeToNewMessages: Function,
  isLoading: boolean,
  hasError: boolean,
  isFetchingMore: boolean,
  setLastSeen: Function,
  toggleReaction: Function,
};

type State = {
  subscription: ?Function,
};

class MessagesWithData extends React.Component<Props, State> {
  state = {
    subscription: null,
  };

  componentDidMount() {
    this.props.forceScrollToBottom();
    this.subscribe();
  }

  componentDidUpdate(prev) {
    const { contextualScrollToBottom, data, setLastSeen } = this.props;

    if (this.props.data.loading) {
      this.unsubscribe();
    }

    if (
      prev.data.networkStatus === 1 &&
      prev.data.loading &&
      !this.props.data.loading
    ) {
      this.subscribe();
      setTimeout(() => this.props.forceScrollToBottom());
    }
    // force scroll to bottom when a message is sent in the same thread
    if (prev.data.messages !== data.messages && contextualScrollToBottom) {
      // mark this thread as unread when new messages come in and i'm viewing it
      setLastSeen(data.directMessageThread.id);
      contextualScrollToBottom();
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  subscribe = () => {
    this.setState({
      subscription: this.props.subscribeToNewMessages(),
    });
  };

  unsubscribe = () => {
    const { subscription } = this.state;
    if (subscription) {
      // This unsubscribes the subscription
      subscription();
    }
  };

  render() {
    const {
      data: { messages, hasNextPage, fetchMore },
      hasError,
      isLoading,
      isFetchingMore,
      toggleReaction,
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
          {hasNextPage && (
            <NextPageButton
              isFetchingMore={isFetchingMore}
              fetchMore={fetchMore}
            />
          )}
          <ChatMessages
            toggleReaction={toggleReaction}
            messages={sortedMessages}
            forceScrollToBottom={this.props.forceScrollToBottom}
            contextualScrollToBottom={this.props.contextualScrollToBottom}
            threadId={this.props.id}
            threadType={'directMessageThread'}
          />
        </MessagesScrollWrapper>
      );
    }

    if (isLoading) {
      return <Loading />;
    }

    return null;
  }
}

const Messages = compose(
  toggleReactionMutation,
  setLastSeenMutation,
  getDirectMessageThreadMessages,
  viewNetworkHandler
)(MessagesWithData);

export default Messages;
