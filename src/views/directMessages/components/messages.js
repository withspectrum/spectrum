// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
import { sortAndGroupMessages } from '../../../helpers/messages';
import ChatMessages from '../../../components/chatMessages';
import { Loading } from '../../../components/loading';
import { Spinner } from '../../../components/globals';
import { getDirectMessageThreadMessages } from '../queries';
import { toggleReactionMutation } from '../mutations';
import { MessagesScrollWrapper, HasNextPage, NextPageButton } from './style';

class MessagesWithData extends Component {
  state: {
    subscription: ?Object,
  };

  state = {
    subscription: null,
  };

  componentDidMount() {
    this.props.forceScrollToBottom();
    this.subscribe();
  }

  componentDidUpdate(prev) {
    const { contextualScrollToBottom, data } = this.props;

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
      data: { error, loading, messages, hasNextPage, fetchMore, networkStatus },
    } = this.props;
    const { subscription } = this.state;

    if (error) {
      return <div>Error!</div>;
    }

    // NOTE(@mxstbr): The networkStatus check shouldn't be there, but if I remove
    // it the loading indicator doesn't show when switching between threads which
    // is hella annoying as the old msgs stick around until the new ones are there.
    // TODO: FIXME and remove the networkStatus === 7
    if (messages && networkStatus === 7) {
      let sortedMessages = sortAndGroupMessages(messages);

      return (
        <MessagesScrollWrapper>
          {hasNextPage &&
            <HasNextPage>
              <NextPageButton
                loading={networkStatus === 3}
                onClick={() => fetchMore()}
              >
                {networkStatus === 3
                  ? <Spinner size={16} color={'brand.default'} />
                  : 'Load previous messages'}
              </NextPageButton>
            </HasNextPage>}
          <ChatMessages
            toggleReaction={this.props.toggleReaction}
            messages={sortedMessages}
            forceScrollToBottom={this.props.forceScrollToBottom}
            contextualScrollToBottom={this.props.contextualScrollToBottom}
            threadId={this.props.id}
            threadType={'directMessageThread'}
          />
        </MessagesScrollWrapper>
      );
    }

    if (networkStatus === 7) {
      return null;
    } else {
      return <Loading />;
    }
  }
}

const Messages = compose(
  toggleReactionMutation,
  getDirectMessageThreadMessages,
  pure
)(MessagesWithData);

export default Messages;
