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
  InputWrapper,
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
  const cacheKey = `last-content-${props.thread}`;
  const [text, changeText] = React.useState('');
  const [photoSizeError, setPhotoSizeError] = React.useState('');

  // On mount, set the text state to the cached value if one exists
  React.useEffect(
    () => {
      changeText(localStorage.getItem(cacheKey) || '');
      // NOTE(@mxstbr): We ONLY want to run this if we switch between threads, never else!
    },
    [props.thread]
  );

  // Cache the latest text everytime it changes
  React.useEffect(
    () => {
      localStorage.setItem(cacheKey, text);
    },
    [text]
  );

  const removeAttachments = () => {
    removeQuotedMessage();
    setMediaPreview(null);
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
    changeText(text);
  };

  const sendMessage = ({ file, body }: { file?: any, body?: string }) => {
    // user is creating a new directMessageThread, break the chain
    // and initiate a new group creation with the message being sent
    // in views/directMessages/containers/newThread.js
    if (props.thread === 'newDirectMessageThread') {
      if (file) {
        return props.createThread({
          messageType: 'media',
          file,
        });
      } else {
        return props.createThread({
          messageBody: body,
          messageType: 'text',
        });
      }
    }

    const method =
      props.threadType === 'story'
        ? props.sendMessage
        : props.sendDirectMessage;
    return method({
      threadId: props.thread,
      messageType: file ? 'media' : 'text',
      threadType: props.threadType,
      parentId: props.quotedMessage,
      content: {
        body,
      },
      file,
    });
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

    if (mediaPreviewFile) {
      setIsSendingMediaMessage(true);
      let reader = new FileReader();
      reader.onloadend = () => {
        if (props.forceScrollToBottom) props.forceScrollToBottom();
        sendMessage({ file: mediaPreviewFile, body: reader.result })
          .then(() => setIsSendingMediaMessage(false))
          .catch(err => {
            setIsSendingMediaMessage(false);
            props.dispatch(addToastWithTimeout('error', err.message));
          });
      };
      reader.readAsDataURL(mediaPreviewFile);
    }

    if (text.length === 0) return;

    // Clear the chat input now that we're sending a message for sure
    onChange({ target: { value: '' } });
    removeQuotedMessage();

    sendMessage({ body: text })
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

  const [isSendingMediaMessage, setIsSendingMediaMessage] = React.useState(
    false
  );
  const [mediaPreview, setMediaPreview] = React.useState(null);
  const [mediaPreviewFile, setMediaPreviewFile] = React.useState(null);

  const previewMedia = blob => {
    if (isSendingMediaMessage) return;
    setIsSendingMediaMessage(true);
    setMediaPreviewFile(blob);

    const reader = new FileReader();
    reader.onload = () => {
      setMediaPreview(reader.result.toString());
      setIsSendingMediaMessage(false);
    };

    if (blob) {
      reader.readAsDataURL(blob);
    }
  };

  const removeQuotedMessage = () => {
    if (props.quotedMessage)
      props.dispatch(
        replyToMessage({ threadId: props.thread, messageId: null })
      );
  };

  return (
    <React.Fragment>
      <ChatInputContainer>
        {photoSizeError && (
          <PhotoSizeError>
            <p>{photoSizeError}</p>
            <Icon
              onClick={() => setPhotoSizeError('')}
              glyph="view-close"
              size={16}
              color={'warn.default'}
            />
          </PhotoSizeError>
        )}
        <ChatInputWrapper>
          {props.currentUser && (
            <MediaUploader
              isSendingMediaMessage={isSendingMediaMessage}
              currentUser={props.currentUser}
              onValidated={previewMedia}
              onError={err => setPhotoSizeError(err)}
            />
          )}
          <Form onSubmit={submit}>
            <InputWrapper
              hasAttachment={!!props.quotedMessage || !!mediaPreview}
              networkDisabled={!props.networkOnline}
            >
              {mediaPreview && (
                <PreviewWrapper>
                  <img src={mediaPreview} alt="" />
                  <RemovePreviewButton onClick={() => setMediaPreview(null)}>
                    <Icon glyph="view-close-small" size={'16'} />
                  </RemovePreviewButton>
                </PreviewWrapper>
              )}
              {props.quotedMessage && (
                <PreviewWrapper data-cy="staged-quoted-message">
                  <QuotedMessage
                    id={props.quotedMessage}
                    threadId={props.thread}
                  />
                  <RemovePreviewButton
                    data-cy="remove-staged-quoted-message"
                    onClick={removeQuotedMessage}
                  >
                    <Icon glyph="view-close-small" size={'16'} />
                  </RemovePreviewButton>
                </PreviewWrapper>
              )}
              <Input
                hasAttachment={!!props.quotedMessage || !!mediaPreview}
                networkDisabled={!props.networkOnline}
                placeholder="Your message here..."
                value={text}
                onChange={onChange}
                onKeyDown={handleKeyPress}
                ref={ref}
              />
            </InputWrapper>
            <SendButton
              data-cy="chat-input-send-button"
              glyph="send-fill"
              onClick={submit}
              // hasAttachment={mediaPreview || quotedMessage ? true : false}
            />
          </Form>
        </ChatInputWrapper>
      </ChatInputContainer>
      <MarkdownHint showHint={text.length > 0} data-cy="markdownHint">
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
