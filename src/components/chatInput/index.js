// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import debounce from 'debounce';
import Icon from 'src/components/icons';
import { addToastWithTimeout } from 'src/actions/toasts';
import { openModal } from 'src/actions/modals';
import { replyToMessage } from 'src/actions/message';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  Form,
  ChatInputContainer,
  ChatInputWrapper,
  Input,
  SendButton,
  PhotoSizeError,
  MarkdownHint,
  Preformatted,
  PreviewWrapper,
  RemovePreviewButton,
} from './style';
import sendMessage from 'shared/graphql/mutations/message/sendMessage';
import sendDirectMessage from 'shared/graphql/mutations/message/sendDirectMessage';
import { getMessageById } from 'shared/graphql/queries/message/getMessage';
import MediaUploader from './components/mediaUploader';
import { QuotedMessage as QuotedMessageComponent } from '../message/view';
import type { Dispatch } from 'redux';

const QuotedMessage = connect()(
  getMessageById(props => {
    if (props.data && props.data.message) {
      return <QuotedMessageComponent message={props.data.message} />;
    }

    // if the query is done loading and no message was returned, clear the input
    if (props.data && props.data.networkStatus === 7 && !props.data.message) {
      props.dispatch(
        addToastWithTimeout(
          'error',
          'The message you are replying to was deleted or could not be fetched.'
        )
      );
      props.dispatch(
        replyToMessage({ threadId: props.threadId, messageId: null })
      );
    }

    return null;
  })
);

const LS_KEY = 'last-chat-input-content';
const LS_KEY_EXPIRE = 'last-chat-input-content-expire';
const LS_DM_KEY = 'last-chat-input-content-dm';
const LS_DM_KEY_EXPIRE = 'last-chat-input-content-dm-expire';

type Props = {
  onRef: Function,
  currentUser: Object,
  dispatch: Dispatch<Object>,
  createThread: Function,
  sendMessage: Function,
  sendDirectMessage: Function,
  forceScrollToBottom: Function,
  threadType: string,
  thread: string,
  clear: Function,
  websocketConnection: string,
  networkOnline: boolean,
  threadData?: Object,
  refetchThread?: Function,
  quotedMessage: ?{ messageId: string, threadId: string },
};

const ChatInput = React.forwardRef((props: Props, ref) => {
  const [text, changeText] = React.useState('');
  const [showMarkdownHint, setShowMarkdownHint] = React.useState(false);

  const removeAttachments = () => {
    // Remove media preview and quoted message
  };

  const handleKeyPress = e => {
    switch (e.key) {
      // Submit on Enter unless Shift is pressed
      case 'Enter': {
        if (e.shiftKey) return;
        e.preventDefault();
        submit();
        return;
      }
      // If backspace is pressed on the empty
      case 'Backspace': {
        if (text.length === 0) removeAttachments();
        return;
      }
    }
  };

  const onChange = e => {
    const text = e.target.value;
    const newShowMarkdownHint = text.length > 0;
    if (newShowMarkdownHint !== showMarkdownHint)
      setShowMarkdownHint(newShowMarkdownHint);
    changeText(text);
  };

  const submit = e => {
    if (e) e.preventDefault();

    if (!props.networkOnline) {
      return props.dispatch(
        addToastWithTimeout(
          'error',
          'Not connected to the internet - check your internet connection or try again'
        )
      );
    }

    if (
      props.websocketConnection !== 'connected' &&
      props.websocketConnection !== 'reconnected'
    ) {
      return props.dispatch(
        addToastWithTimeout(
          'error',
          'Error connecting to the server - hang tight while we try to reconnect'
        )
      );
    }

    if (!props.currentUser) {
      // user is trying to send a message without being signed in
      return props.dispatch(openModal('CHAT_INPUT_LOGIN_MODAL', {}));
    }

    // If a user sends a message, force a scroll to bottom. This doesn't exist if this is a new DM thread
    if (props.forceScrollToBottom) props.forceScrollToBottom();

    if (text.length === 0) return;

    // user is creating a new directMessageThread, break the chain
    // and initiate a new group creation with the message being sent
    // in views/directMessages/containers/newThread.js
    if (props.thread === 'newDirectMessageThread') {
      props.createThread({
        messageBody: text,
        messageType: 'text',
      });
      return;
    }

    // Clear the chat input now that we're sending a message for sure
    onChange({ target: { value: '' } });

    // Add a new line on shift+enter, don't submit
    const method =
      props.threadType === 'story'
        ? props.sendMessage
        : props.sendDirectMessage;
    method({
      threadId: props.thread,
      messageType: 'text',
      threadType: props.threadType,
      // parentId: quotedMessage,
      content: {
        body: text,
      },
    })
      .then(() => {
        // If we're viewing a thread and the user sends a message as a non-member, we need to refetch the thread data
        if (
          props.threadType === 'story' &&
          props.threadData &&
          !props.threadData.channel.channelPermissions.isMember &&
          props.refetchThread
        ) {
          return props.refetchThread();
        }
      })
      .catch(err => {
        props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  return (
    <React.Fragment>
      <ChatInputContainer>
        <ChatInputWrapper>
          <Form onSubmit={submit}>
            <Input
              placeholder="Your message here..."
              value={text}
              onChange={onChange}
              onKeyDown={handleKeyPress}
              ref={ref}
            />
            <SendButton
              data-cy="chat-input-send-button"
              glyph="send-fill"
              onClick={submit}
              // hasAttachment={mediaPreview || quotedMessage ? true : false}
            />
          </Form>
        </ChatInputWrapper>
      </ChatInputContainer>
      <MarkdownHint showHint={showMarkdownHint} data-cy="markdownHint">
        <b>**bold**</b>
        <i>*italic*</i>
        <Preformatted>`code`</Preformatted>
        <Preformatted>```codeblock```</Preformatted>
      </MarkdownHint>
    </React.Fragment>
  );
});

const map = (state, ownProps) => ({
  websocketConnection: state.connectionStatus.websocketConnection,
  networkOnline: state.connectionStatus.networkOnline,
  quotedMessage: state.message.quotedMessage[ownProps.thread] || null,
});

export default compose(
  withCurrentUser,
  sendMessage,
  sendDirectMessage,
  // $FlowIssue
  connect(map)
)(ChatInput);
