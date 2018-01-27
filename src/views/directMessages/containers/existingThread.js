// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import { track } from '../../../helpers/events';
import setLastSeenMutation from 'shared/graphql/mutations/directMessageThread/setDMThreadLastSeen';
import Messages from '../components/messages';
import Header from '../components/header';
import ChatInput from '../../../components/chatInput';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import getDirectMessageThread from 'shared/graphql/queries/directMessageThread/getDirectMessageThread';
import { MessagesContainer, ViewContent } from '../style';
import { Loading } from '../../../components/loading';
import ViewError from '../../../components/viewError';

type Props = {
  data: Object,
  isLoading: boolean,
  setActiveThread: Function,
  setLastSeen: Function,
  match: Object,
  id: ?string,
  currentUser: Object,
  threadSliderIsOpen: boolean,
};
class ExistingThread extends React.Component<Props> {
  scrollBody: ?HTMLDivElement;
  chatInput: ?ChatInput;

  componentDidMount() {
    const threadId = this.props.id;
    this.props.setActiveThread(threadId);
    this.props.setLastSeen(threadId);
    this.forceScrollToBottom();

    // autofocus on desktop
    if (window && window.innerWidth > 768 && this.chatInput) {
      this.chatInput.triggerFocus();
    }

    track('direct message thread', 'viewed', null);
  }

  componentDidUpdate(prevProps) {
    // if the thread slider is open, dont be focusing shit up in heyuhr
    if (this.props.threadSliderIsOpen) return;
    // if the thread slider is closed and we're viewing DMs, refocus the chat input
    if (
      prevProps.threadSliderIsOpen &&
      !this.props.threadSliderIsOpen &&
      this.chatInput
    ) {
      this.chatInput.triggerFocus();
    }
    if (prevProps.match.params.threadId !== this.props.match.params.threadId) {
      const threadId = this.props.match.params.threadId;
      this.props.setActiveThread(threadId);
      this.props.setLastSeen(threadId);
      this.forceScrollToBottom();
      // autofocus on desktop
      if (window && window.innerWidth > 768 && this.chatInput) {
        this.chatInput.triggerFocus();
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
              <Header thread={thread} currentUser={currentUser} />
              <Messages
                id={id}
                threadType={thread.threadType}
                currentUser={currentUser}
                forceScrollToBottom={this.forceScrollToBottom}
                contextualScrollToBottom={this.contextualScrollToBottom}
              />
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

const map = state => ({ threadSliderIsOpen: state.threadSlider.isOpen });
export default compose(
  // $FlowIssue
  connect(map),
  getDirectMessageThread,
  setLastSeenMutation,
  withApollo,
  viewNetworkHandler
)(ExistingThread);
