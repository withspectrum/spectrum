// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { sortAndGroupMessages } from 'shared/clients/group-messages';
import ChatMessages from '../../../components/messageGroup';
import { Loading } from '../../../components/loading';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import NextPageButton from '../../../components/nextPageButton';
import getDirectMessageThreadMessages from 'shared/graphql/queries/directMessageThread/getDirectMessageThreadMessageConnection';
import type { GetDirectMessageThreadMessageConnectionType } from 'shared/graphql/queries/directMessageThread/getDirectMessageThreadMessageConnection';
import setLastSeenMutation from 'shared/graphql/mutations/directMessageThread/setDMThreadLastSeen';
import toggleReactionMutation from 'shared/graphql/mutations/reaction/toggleReaction';
import { MessagesScrollWrapper } from './style';

type Props = {
  id: string,
  forceScrollToBottom: Function,
  contextualScrollToBottom: Function,
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
      setTimeout(() => this.props.forceScrollToBottom());
      // mark this thread as unread when new messages come in and i'm viewing it
      if (data.directMessageThread) setLastSeen(data.directMessageThread.id);
      contextualScrollToBottom();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      !!this.props.data.directMessageThread &&
      !nextProps.data.directMessageThread
    ) {
      return false;
    } else {
      return true;
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
