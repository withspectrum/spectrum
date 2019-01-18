// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import setLastSeenMutation from 'shared/graphql/mutations/directMessageThread/setDMThreadLastSeen';
import Messages from '../components/messages';
import Header from '../components/header';
import ChatInput from 'src/components/chatInput';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import getDirectMessageThread, {
  type GetDirectMessageThreadType,
} from 'shared/graphql/queries/directMessageThread/getDirectMessageThread';
import { MessagesContainer, ViewContent } from '../style';
import { Loading } from 'src/components/loading';
import ViewError from 'src/components/viewError';
import { ErrorBoundary } from 'src/components/error';
import type { WebsocketConnectionType } from 'src/reducers/connectionStatus';
import { useConnectionRestored } from 'src/hooks/useConnectionRestored';
import { withCurrentUser } from 'src/components/withCurrentUser';

type Props = {
  data: {
    refetch: Function,
    directMessageThread: GetDirectMessageThreadType,
  },
  isLoading: boolean,
  setLastSeen: Function,
  match: Object,
  id: ?string,
  currentUser: Object,
  threadSliderIsOpen: boolean,
  networkOnline: boolean,
  websocketConnection: WebsocketConnectionType,
};

class ExistingThread extends React.Component<Props> {
  scrollBody: ?HTMLDivElement;
  chatInput: ?ChatInput;

  componentDidMount() {
    const { threadId } = this.props.match.params;

    // escape to prevent this from running on mobile
    if (!threadId) return;

    this.props.setLastSeen(threadId);
    this.forceScrollToBottom();
    // autofocus on desktop
    if (window && window.innerWidth > 768 && this.chatInput) {
      this.chatInput.focus();
    }
  }

  componentDidUpdate(prev) {
    const curr = this.props;

    const didReconnect = useConnectionRestored({ curr, prev });
    if (didReconnect && curr.data.refetch) {
      curr.data.refetch();
    }

    // if the thread slider is open, dont be focusing shit up in heyuhr
    if (curr.threadSliderIsOpen) return;
    // if the thread slider is closed and we're viewing DMs, refocus the chat input
    if (prev.threadSliderIsOpen && !curr.threadSliderIsOpen && this.chatInput) {
      this.chatInput.focus();
    }
    // as soon as the direct message thread is loaded, refocus the chat input
    if (
      curr.data.directMessageThread &&
      !prev.data.directMessageThread &&
      this.chatInput
    ) {
      this.chatInput.focus();
    }
    if (prev.match.params.threadId !== curr.match.params.threadId) {
      const threadId = curr.match.params.threadId;

      // prevent unnecessary behavior on mobile
      if (!threadId) return;

      curr.setLastSeen(threadId);
      this.forceScrollToBottom();
      // autofocus on desktop
      if (window && window.innerWidth > 768 && this.chatInput) {
        this.chatInput.focus();
      }
    }
  }

  forceScrollToBottom = () => {
    if (!this.scrollBody) return;
    let node = this.scrollBody;
    node.scrollTop = node.scrollHeight - node.clientHeight;
  };

  contextualScrollToBottom = () => {
    if (!this.scrollBody) return;
    let node = this.scrollBody;
    if (node.scrollHeight - node.clientHeight < node.scrollTop + 140) {
      node.scrollTop = node.scrollHeight - node.clientHeight;
    }
  };

  render() {
    const id = this.props.match.params.threadId;
    const { currentUser, data, isLoading } = this.props;

    if (id !== 'new') {
      if (data.directMessageThread) {
        const thread = data.directMessageThread;
        return (
          <MessagesContainer>
            <ViewContent
              innerRef={scrollBody => (this.scrollBody = scrollBody)}
            >
              {!isLoading ? (
                <React.Fragment>
                  <ErrorBoundary>
                    <Header thread={thread} currentUser={currentUser} />
                  </ErrorBoundary>

                  <Messages
                    id={id}
                    currentUser={currentUser}
                    forceScrollToBottom={this.forceScrollToBottom}
                    contextualScrollToBottom={this.contextualScrollToBottom}
                  />
                </React.Fragment>
              ) : (
                <Loading />
              )}
            </ViewContent>

            <ChatInput
              thread={id}
              currentUser={currentUser}
              threadType={'directMessageThread'}
              forceScrollToBottom={this.forceScrollToBottom}
              onRef={chatInput => (this.chatInput = chatInput)}
            />
          </MessagesContainer>
        );
      }

      if (isLoading) {
        return <Loading />;
      }

      return (
        <ViewError
          heading={'We had trouble loading this conversation'}
          refresh
        />
      );
    }

    /*
      if we are viewing /new we will handle the messages view in the composer
      component
    */
    return null;
  }
}

const map = state => ({
  networkOnline: state.connectionStatus.networkOnline,
  websocketConnection: state.connectionStatus.websocketConnection,
  threadSliderIsOpen: state.threadSlider.isOpen,
});
export default compose(
  // $FlowIssue
  connect(map),
  getDirectMessageThread,
  setLastSeenMutation,
  withApollo,
  withCurrentUser,
  viewNetworkHandler
)(ExistingThread);
