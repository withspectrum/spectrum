// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { KeyBindingUtil } from 'draft-js';
import debounce from 'debounce';
import Icon from '../../components/icons';
import { track } from '../../helpers/events';
import {
  toJSON,
  toState,
  fromPlainText,
  toPlainText,
  isAndroid,
} from 'shared/draft-utils';
import mentionsDecorator from 'shared/clients/draft-js/mentions-decorator/index.web.js';
import linksDecorator from 'shared/clients/draft-js/links-decorator/index.web.js';
import { addToastWithTimeout } from '../../actions/toasts';
import { openModal } from '../../actions/modals';
import { replyToMessage } from '../../actions/message';
import {
  Form,
  ChatInputContainer,
  ChatInputWrapper,
  SendButton,
  PhotoSizeError,
  MarkdownHint,
  Preformatted,
  PreviewWrapper,
  RemovePreviewButton,
} from './style';
import Input from './input';
import sendMessage from 'shared/graphql/mutations/message/sendMessage';
import sendDirectMessage from 'shared/graphql/mutations/message/sendDirectMessage';
import { getMessageById } from 'shared/graphql/queries/message/getMessage';
import MediaUploader from './components/mediaUploader';
import { QuotedMessage as QuotedMessageComponent } from '../message/view';

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
      props.dispatch(replyToMessage(null));
    }

    return null;
  })
);

type State = {
  isFocused: boolean,
  photoSizeError: string,
  isSendingMediaMessage: boolean,
  mediaPreview: string,
  mediaPreviewFile: ?Blob,
  markdownHint: boolean,
};

type Props = {
  onRef: Function,
  currentUser: Object,
  dispatch: Function,
  onChange: Function,
  state: Object,
  createThread: Function,
  sendMessage: Function,
  sendDirectMessage: Function,
  forceScrollToBottom: Function,
  threadType: string,
  thread: string,
  clear: Function,
  onBlur: Function,
  onFocus: Function,
  websocketConnection: string,
  networkOnline: boolean,
  threadData?: Object,
  refetchThread?: Function,
  quotedMessage: ?string,
};

const LS_KEY = 'last-chat-input-content';
let storedContent;
// We persist the body and title to localStorage
// so in case the app crashes users don't loose content
if (localStorage) {
  try {
    storedContent = toState(JSON.parse(localStorage.getItem(LS_KEY) || ''));
  } catch (err) {
    localStorage.removeItem(LS_KEY);
  }
}

const forcePersist = content =>
  localStorage && localStorage.setItem(LS_KEY, JSON.stringify(toJSON(content)));
const persistContent = debounce(content => {
  localStorage && localStorage.setItem(LS_KEY, JSON.stringify(toJSON(content)));
}, 500);

class ChatInput extends React.Component<Props, State> {
  state = {
    isFocused: false,
    photoSizeError: '',
    code: false,
    isSendingMediaMessage: false,
    mediaPreview: '',
    mediaPreviewFile: null,
    markdownHint: false,
  };

  editor: any;

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, true);
    this.props.onRef(this);
  }

  shouldComponentUpdate(next, nextState) {
    const curr = this.props;
    const currState = this.state;

    // User changed
    if (curr.currentUser !== next.currentUser) return true;

    if (curr.networkOnline !== next.networkOnline) return true;
    if (curr.websocketConnection !== next.websocketConnection) return true;

    if (curr.quotedMessage !== next.quotedMessage) return true;

    // State changed
    if (curr.state !== next.state) return true;
    if (currState.isSendingMediaMessage !== nextState.isSendingMediaMessage)
      return true;
    if (currState.mediaPreview !== nextState.mediaPreview) return true;
    if (currState.photoSizeError !== nextState.photoSizeError) return true;

    return false;
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.props.onRef(undefined);
  }

  handleKeyDown = (event: any) => {
    const key = event.keyCode || event.charCode;
    // Detect esc key or backspace key (and empty message) to remove
    // the previewed image and quoted message
    if (
      key === 27 ||
      ((key === 8 || key === 46) &&
        !this.props.state.getCurrentContent().hasText())
    ) {
      this.removePreviewWrapper();
      this.removeQuotedMessage();
    }
  };

  removeQuotedMessage = () => {
    if (this.props.quotedMessage) this.props.dispatch(replyToMessage(null));
  };

  onChange = (state, ...rest) => {
    const { onChange } = this.props;

    this.toggleMarkdownHint(state);
    persistContent(state);
    onChange(state, ...rest);
  };

  toggleMarkdownHint = state => {
    // eslint-disable-next-line
    let hasText = false;
    // NOTE(@mxstbr): This throws an error on focus, so we just ignore that
    try {
      hasText = state.getCurrentContent().hasText();
    } catch (err) {}
    this.setState({
      markdownHint: state.getCurrentContent().hasText() ? true : false,
    });
  };

  triggerFocus = () => {
    // NOTE(@mxstbr): This needs to be delayed for a tick, otherwise the
    // decorators that are passed to the editor are removed from the editor
    // state
    setTimeout(() => {
      this.editor && this.editor.focus();
    }, 0);
  };

  submit = e => {
    if (e) e.preventDefault();

    const {
      state,
      thread,
      threadType,
      createThread,
      dispatch,
      sendMessage,
      sendDirectMessage,
      clear,
      forceScrollToBottom,
      networkOnline,
      websocketConnection,
      currentUser,
      threadData,
      refetchThread,
      quotedMessage,
    } = this.props;

    const isSendingMessageAsNonMember =
      threadType === 'story' &&
      threadData &&
      !threadData.channel.channelPermissions.isMember;

    if (!networkOnline) {
      return dispatch(
        addToastWithTimeout(
          'error',
          'Not connected to the internet - check your internet connection or try again'
        )
      );
    }

    if (
      websocketConnection !== 'connected' &&
      websocketConnection !== 'reconnected'
    ) {
      return dispatch(
        addToastWithTimeout(
          'error',
          'Error connecting to the server - hang tight while we try to reconnect'
        )
      );
    }

    if (!currentUser) {
      // user is trying to send a message without being signed in
      return dispatch(openModal('CHAT_INPUT_LOGIN_MODAL', {}));
    }

    // This doesn't exist if this is a new conversation
    if (forceScrollToBottom) {
      // if a user sends a message, force a scroll to bottom
      forceScrollToBottom();
    }

    if (this.state.mediaPreview.length) {
      this.sendMediaMessage(this.state.mediaPreviewFile);
    }

    // If the input is empty don't do anything
    if (!state.getCurrentContent().hasText()) return 'handled';

    // do one last persist before sending
    forcePersist(state);
    this.removeQuotedMessage();

    // user is creating a new directMessageThread, break the chain
    // and initiate a new group creation with the message being sent
    // in views/directMessages/containers/newThread.js
    if (thread === 'newDirectMessageThread') {
      createThread({
        messageBody: !isAndroid()
          ? JSON.stringify(toJSON(state))
          : toPlainText(state),
        messageType: !isAndroid() ? 'draftjs' : 'text',
      });
      clear();
      return 'handled';
    }

    // user is sending a message to an existing thread id - either a thread
    // or direct message thread
    if (threadType === 'directMessageThread') {
      sendDirectMessage({
        threadId: thread,
        messageType: !isAndroid() ? 'draftjs' : 'text',
        threadType,
        parentId: quotedMessage,
        content: {
          body: !isAndroid()
            ? JSON.stringify(toJSON(state))
            : toPlainText(state),
        },
      })
        .then(() => {
          localStorage.removeItem(LS_KEY);
          return track(`${threadType} message`, 'text message created', null);
        })
        .catch(err => {
          dispatch(addToastWithTimeout('error', err.message));
        });
    } else {
      sendMessage({
        threadId: thread,
        messageType: !isAndroid() ? 'draftjs' : 'text',
        threadType,
        parentId: quotedMessage,
        content: {
          body: !isAndroid()
            ? JSON.stringify(toJSON(state))
            : toPlainText(state),
        },
      })
        .then(() => {
          // if the user sends a message as a non member of the community or
          // channel, we need to refetch the thread to update any join buttons
          // and update all clientside caching of community + channel permissions
          if (isSendingMessageAsNonMember) {
            if (refetchThread) {
              refetchThread();
            }
          }

          localStorage.removeItem(LS_KEY);
          return track(`${threadType} message`, 'text message created', null);
        })
        .catch(err => {
          dispatch(addToastWithTimeout('error', err.message));
        });
    }

    // refocus the input
    setTimeout(() => {
      clear();
      this.editor && this.editor.focus();
    });

    return 'handled';
  };

  handleReturn = e => {
    // Always submit on CMD+Enter
    if (KeyBindingUtil.hasCommandModifier(e)) {
      return this.submit(e);
    }

    // SHIFT+Enter should always add a new line
    if (e.shiftKey) return 'not-handled';

    const currentContent = this.props.state.getCurrentContent();
    const selection = this.props.state.getSelection();
    const key = selection.getStartKey();
    const blockMap = currentContent.getBlockMap();
    const block = blockMap.get(key);

    // If we're in a code block or starting one don't submit on enter
    if (
      block.get('type') === 'code-block' ||
      block.get('text').indexOf('```') === 0
    ) {
      return 'not-handled';
    }

    return this.submit(e);
  };

  removePreviewWrapper = () => {
    this.setState({
      mediaPreview: '',
      mediaPreviewFile: null,
    });
  };

  sendMediaMessage = (file: ?Blob) => {
    if (file == null) {
      return;
    }

    this.removePreviewWrapper();

    // eslint-disable-next-line
    let reader = new FileReader();

    const {
      thread,
      threadType,
      createThread,
      dispatch,
      forceScrollToBottom,
      sendDirectMessage,
      sendMessage,
      websocketConnection,
      networkOnline,
      quotedMessage,
    } = this.props;

    if (!networkOnline) {
      return dispatch(
        addToastWithTimeout(
          'error',
          'Not connected to the internet - check your internet connection or try again'
        )
      );
    }

    if (
      websocketConnection !== 'connected' &&
      websocketConnection !== 'reconnected'
    ) {
      return dispatch(
        addToastWithTimeout(
          'error',
          'Error connecting to the server - hang tight while we try to reconnect'
        )
      );
    }

    this.setState({
      isSendingMediaMessage: true,
    });

    reader.onloadend = () => {
      if (forceScrollToBottom) {
        forceScrollToBottom();
      }

      if (thread === 'newDirectMessageThread') {
        return createThread({
          messageType: 'media',
          file,
        });
      }

      if (threadType === 'directMessageThread') {
        sendDirectMessage({
          threadId: thread,
          messageType: 'media',
          threadType,
          parentId: quotedMessage,
          content: {
            body: reader.result,
          },
          file,
        })
          .then(() => {
            this.setState({
              isSendingMediaMessage: false,
            });
            return track(
              `${threadType} message`,
              'media message created',
              null
            );
          })
          .catch(err => {
            this.setState({
              isSendingMediaMessage: false,
            });
            dispatch(addToastWithTimeout('error', err.message));
          });
      } else {
        sendMessage({
          threadId: thread,
          messageType: 'media',
          threadType,
          parentId: quotedMessage,
          content: {
            body: reader.result,
          },
          file,
        })
          .then(() => {
            this.setState({
              isSendingMediaMessage: false,
            });
            return track(
              `${threadType} message`,
              'media message created',
              null
            );
          })
          .catch(err => {
            this.setState({
              isSendingMediaMessage: false,
            });
            dispatch(addToastWithTimeout('error', err.message));
          });
      }
    };

    reader.readAsDataURL(file);
  };

  onFocus = () => {
    /*
      The new direct message thread component needs to know if the chat input is focused. That component passes down an onFocus prop, which should be called if it exists
    */
    const { onFocus } = this.props;
    if (onFocus) {
      onFocus();
    }

    this.setState({
      isFocused: true,
    });
  };

  onBlur = () => {
    /*
      The new direct message thread component needs to know if the chat input is focused. That component passes down an onBlur prop, which should be called if it exists
    */
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur();
    }

    this.setState({
      isFocused: false,
    });
  };

  clearError = () => {
    this.setState({ photoSizeError: '' });
  };

  setMediaMessageError = (error: string) => {
    return this.setState({
      photoSizeError: error,
    });
  };

  previewMedia = blob => {
    if (this.state.isSendingMediaMessage) {
      return;
    }
    this.setState({
      isSendingMediaMessage: true,
      mediaPreviewFile: blob,
    });
    const reader = new FileReader();
    reader.onload = () =>
      this.setState({
        mediaPreview: reader.result.toString(),
        isSendingMediaMessage: false,
      });
    reader.readAsDataURL(blob);
  };

  render() {
    const {
      state,
      currentUser,
      networkOnline,
      websocketConnection,
      quotedMessage,
    } = this.props;
    const {
      isFocused,
      photoSizeError,
      isSendingMediaMessage,
      mediaPreview,
      markdownHint,
    } = this.state;

    const networkDisabled =
      !networkOnline ||
      (websocketConnection !== 'connected' &&
        websocketConnection !== 'reconnected');

    return (
      <React.Fragment>
        <ChatInputContainer focus={isFocused} onClick={this.triggerFocus}>
          {photoSizeError && (
            <PhotoSizeError>
              <p
                onClick={() =>
                  this.props.dispatch(
                    openModal('UPGRADE_MODAL', { user: currentUser })
                  )
                }
              >
                {photoSizeError}
              </p>
              <Icon
                onClick={() => this.clearError()}
                glyph="view-close"
                size={16}
                color={'warn.default'}
              />
            </PhotoSizeError>
          )}
          <ChatInputWrapper>
            {currentUser && (
              <MediaUploader
                isSendingMediaMessage={isSendingMediaMessage}
                currentUser={currentUser}
                onValidated={this.previewMedia}
                onError={this.setMediaMessageError}
                inputFocused={isFocused}
              />
            )}
            <Form focus={isFocused}>
              <Input
                focus={isFocused}
                placeholder={`Your message here...`}
                editorState={state}
                handleReturn={this.handleReturn}
                onChange={this.onChange}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                code={false}
                editorRef={editor => (this.editor = editor)}
                editorKey="chat-input"
                decorators={[mentionsDecorator, linksDecorator]}
                networkDisabled={networkDisabled}
                hasAttachment={!!mediaPreview || !!quotedMessage}
              >
                {mediaPreview && (
                  <PreviewWrapper>
                    <img src={mediaPreview} alt="" />
                    <RemovePreviewButton onClick={this.removePreviewWrapper}>
                      <Icon glyph="view-close-small" size={'16'} />
                    </RemovePreviewButton>
                  </PreviewWrapper>
                )}
                {quotedMessage && (
                  <PreviewWrapper data-cy="staged-quoted-message">
                    <QuotedMessage id={quotedMessage} />
                    <RemovePreviewButton
                      data-cy="remove-staged-quoted-message"
                      onClick={this.removeQuotedMessage}
                    >
                      <Icon glyph="view-close-small" size={'16'} />
                    </RemovePreviewButton>
                  </PreviewWrapper>
                )}
              </Input>
              <SendButton
                data-cy="chat-input-send-button"
                glyph="send-fill"
                onClick={this.submit}
                hasAttachment={mediaPreview || quotedMessage ? true : false}
              />
            </Form>
          </ChatInputWrapper>
        </ChatInputContainer>
        <MarkdownHint showHint={markdownHint} data-cy="markdownHint">
          <b>**bold**</b>
          <i>*italics*</i>
          <Preformatted>`code`</Preformatted>
          <Preformatted>```preformatted```</Preformatted>
        </MarkdownHint>
      </React.Fragment>
    );
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
  websocketConnection: state.connectionStatus.websocketConnection,
  networkOnline: state.connectionStatus.networkOnline,
  quotedMessage: state.message.quotedMessage,
});
export default compose(
  sendMessage,
  sendDirectMessage,
  // $FlowIssue
  connect(map),
  withState('state', 'changeState', () => storedContent || fromPlainText('')),
  withHandlers({
    onChange: ({ changeState }) => state => changeState(state),
    clear: ({ changeState }) => () => changeState(fromPlainText('')),
  })
)(ChatInput);
