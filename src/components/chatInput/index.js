// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Icon from 'src/components/icon';
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
  PhotoSizeError,
  PreviewWrapper,
  RemovePreviewButton,
} from './style';
import { PrimaryButton } from 'src/components/button';
import sendMessage from 'shared/graphql/mutations/message/sendMessage';
import sendDirectMessage from 'shared/graphql/mutations/message/sendDirectMessage';
import { getMessageById } from 'shared/graphql/queries/message/getMessage';
import MediaUploader from './components/mediaUploader';
import { QuotedMessage as QuotedMessageComponent } from '../message/view';
import type { Dispatch } from 'redux';
import { MarkdownHint } from 'src/components/markdownHint';
import { useAppScroller } from 'src/hooks/useAppScroller';
import { MEDIA_BREAK } from 'src/components/layout';

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

type Props = {
  onRef: Function,
  currentUser: Object,
  dispatch: Dispatch<Object>,
  createThread: Function,
  sendMessage: Function,
  sendDirectMessage: Function,
  threadType: string,
  threadId: string,
  clear: Function,
  websocketConnection: string,
  networkOnline: boolean,
  refetchThread?: Function,
  quotedMessage: ?{ messageId: string, threadId: string },
  // used to pre-populate the @mention suggestions with participants and the author of the thread
  participants: Array<?Object>,
  onFocus: ?Function,
  onBlur: ?Function,
};

export const cleanSuggestionUserObject = (user: ?Object) => {
  if (!user) return null;
  return {
    ...user,
    id: user.username,
    display: user.username,
    filterName: user.name.toLowerCase(),
  };
};

const ChatInput = (props: Props) => {
  const cacheKey = `last-content-${props.threadId}`;
  const [text, changeText] = React.useState('');
  const [photoSizeError, setPhotoSizeError] = React.useState('');
  const [inputRef, setInputRef] = React.useState(null);
  const { scrollToBottom } = useAppScroller();

  // On mount, set the text state to the cached value if one exists
  // $FlowFixMe
  React.useEffect(() => {
    changeText(localStorage.getItem(cacheKey) || '');
    // NOTE(@mxstbr): We ONLY want to run this if we switch between threads, never else!
  }, [props.threadId]);

  // Cache the latest text everytime it changes
  // $FlowFixMe
  React.useEffect(() => {
    localStorage.setItem(cacheKey, text);
  }, [text]);

  // Focus chatInput when quoted message changes
  // $FlowFixMe
  React.useEffect(() => {
    if (inputRef) inputRef.focus();
  }, [props.quotedMessage && props.quotedMessage.messageId]);

  React.useEffect(() => {
    // autofocus the chat input on desktop
    if (inputRef && window && window.innerWidth > MEDIA_BREAK) inputRef.focus();
  }, [inputRef]);

  const removeAttachments = () => {
    removeQuotedMessage();
    setMediaPreview(null);
  };

  const handleKeyPress = e => {
    // We shouldn't do anything during composition of IME.
    // `keyCode === 229` is a fallback for old browsers like IE.
    if (e.isComposing || e.keyCode === 229) {
      return;
    }
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
      default:
        return;
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
    if (props.threadId === 'newDirectMessageThread') {
      return props.createThread({
        messageType: file ? 'media' : 'text',
        file,
        messageBody: body,
      });
    }

    const method =
      props.threadType === 'story'
        ? props.sendMessage
        : props.sendDirectMessage;
    return method({
      threadId: props.threadId,
      messageType: file ? 'media' : 'text',
      threadType: props.threadType,
      parentId: props.quotedMessage,
      content: {
        body,
      },
      file,
    });
  };

  const submit = async e => {
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
      return props.dispatch(openModal('LOGIN_MODAL', {}));
    }

    scrollToBottom();

    if (mediaFile) {
      setIsSendingMediaMessage(true);
      scrollToBottom();
      await sendMessage({
        file: mediaFile,
        body: '{"blocks":[],"entityMap":{}}',
      })
        .then(() => {
          setIsSendingMediaMessage(false);
          setMediaPreview(null);
          setAttachedMediaFile(null);
        })
        .catch(err => {
          setIsSendingMediaMessage(false);
          props.dispatch(addToastWithTimeout('error', err.message));
        });
    }

    if (text.length === 0) return;

    // workaround react-mentions bug by replacing @[username] with @username
    // @see withspectrum/spectrum#4587
    sendMessage({ body: text.replace(/@\[([a-z0-9_-]+)\]/g, '@$1') })
      // .then(() => {
      //   // If we're viewing a thread and the user sends a message as a non-member, we need to refetch the thread data
      //   if (
      //     props.threadType === 'story' &&
      //     props.threadId &&
      //     props.refetchThread
      //   ) {
      //     return props.refetchThread();
      //   }
      // })
      .catch(err => {
        // props.dispatch(addToastWithTimeout('error', err.message));
      });

    // Clear the chat input now that we're sending a message for sure
    onChange({ target: { value: '' } });
    removeQuotedMessage();
    inputRef && inputRef.focus();
  };

  // $FlowFixMe
  const [isSendingMediaMessage, setIsSendingMediaMessage] = React.useState(
    false
  );
  // $FlowFixMe
  const [mediaPreview, setMediaPreview] = React.useState(null);
  // $FlowFixMe
  const [mediaFile, setAttachedMediaFile] = React.useState(null);

  const previewMedia = blob => {
    if (isSendingMediaMessage) return;
    setIsSendingMediaMessage(true);
    setAttachedMediaFile(blob);
    inputRef && inputRef.focus();

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
        replyToMessage({ threadId: props.threadId, messageId: null })
      );
  };

  const networkDisabled =
    !props.networkOnline ||
    (props.websocketConnection !== 'connected' &&
      props.websocketConnection !== 'reconnected');

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
              networkDisabled={networkDisabled}
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
                    threadId={props.threadId}
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
                networkDisabled={networkDisabled}
                placeholder="Your message here..."
                value={text}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
                autoFocus={false}
                onChange={onChange}
                onKeyDown={handleKeyPress}
                inputRef={node => {
                  if (props.onRef) props.onRef(node);
                  setInputRef(node);
                }}
                staticSuggestions={props.participants}
              />
            </InputWrapper>
            <PrimaryButton
              data-cy="chat-input-send-button"
              onClick={submit}
              style={{ flex: 'none', marginLeft: '8px' }}
            >
              Send
            </PrimaryButton>
          </Form>
        </ChatInputWrapper>
      </ChatInputContainer>
      <MarkdownHint showHint={text.length > 0} dataCy="markdownHint" />
    </React.Fragment>
  );
};

const map = (state, ownProps) => ({
  websocketConnection: state.connectionStatus.websocketConnection,
  networkOnline: state.connectionStatus.networkOnline,
  quotedMessage: state.message.quotedMessage[ownProps.threadId] || null,
});

export default compose(
  withCurrentUser,
  sendMessage,
  sendDirectMessage,
  // $FlowIssue
  connect(map)
)(ChatInput);
