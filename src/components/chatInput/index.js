// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import changeCurrentBlockType from 'draft-js-markdown-plugin/lib/modifiers/changeCurrentBlockType';
import { KeyBindingUtil } from 'draft-js';
import debounce from 'debounce';
import Icon from '../../components/icons';
import { IconButton } from '../../components/buttons';
import { track } from '../../helpers/events';
import {
  toJSON,
  toState,
  fromPlainText,
  toPlainText,
} from 'shared/draft-utils';
import mentionsDecorator from 'shared/clients/draft-js/mentions-decorator/index.web.js';
import linksDecorator from 'shared/clients/draft-js/links-decorator/index.web.js';
import { addToastWithTimeout } from '../../actions/toasts';
import { openModal } from '../../actions/modals';
import { Form, ChatInputWrapper, SendButton, PhotoSizeError } from './style';
import Input from './input';
import sendMessage from 'shared/graphql/mutations/message/sendMessage';
import sendDirectMessage from 'shared/graphql/mutations/message/sendDirectMessage';
import MediaUploader from './components/mediaUploader';

type State = {
  isFocused: boolean,
  photoSizeError: string,
  code: boolean,
  isSendingMediaMessage: boolean,
  mediaPreview: string,
  mediaPreviewFile: ?Blob,
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

    // State changed
    if (curr.state !== next.state) return true;
    if (currState.isSendingMediaMessage !== nextState.isSendingMediaMessage)
      return true;
    if (currState.mediaPreview !== nextState.mediaPreview) return true;

    return false;
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.props.onRef(undefined);
  }

  handleKeyDown = (event: any) => {
    const key = event.keyCode || event.charCode;
    // Detect esc key or backspace key (and empty message) to remove
    // the previewed image
    if (
      key === 27 ||
      ((key === 8 || key === 46) && toPlainText(this.props.state).length === 0)
    ) {
      this.removeMediaPreview();
    }
  };

  onChange = (state, ...rest) => {
    const { onChange } = this.props;

    persistContent(state);

    if (toPlainText(state).trim() === '```') {
      this.toggleCodeMessage(false);
    } else if (onChange) {
      onChange(state, ...rest);
    }
  };

  triggerFocus = () => {
    // NOTE(@mxstbr): This needs to be delayed for a tick, otherwise the
    // decorators that are passed to the editor are removed from the editor
    // state
    setTimeout(() => {
      this.editor && this.editor.focus();
    }, 0);
  };

  toggleCodeMessage = (keepCurrentText?: boolean = true) => {
    const { onChange, state } = this.props;
    const { code } = this.state;
    this.setState(
      {
        code: !code,
      },
      () => {
        onChange(
          changeCurrentBlockType(
            state,
            code ? 'unstyled' : 'code-block',
            keepCurrentText ? toPlainText(state) : ''
          )
        );
        setTimeout(() => this.triggerFocus());
      }
    );
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
    if (toPlainText(state).trim() === '') return 'handled';

    // do one last persist before sending
    forcePersist(state);

    this.setState({
      code: false,
    });

    // user is creating a new directMessageThread, break the chain
    // and initiate a new group creation with the message being sent
    // in views/directMessages/containers/newThread.js
    if (thread === 'newDirectMessageThread') {
      createThread({
        messageBody: JSON.stringify(toJSON(state)),
        messageType: 'draftjs',
      });
      clear();
      return 'handled';
    }

    // user is sending a message to an existing thread id - either a thread
    // or direct message thread
    if (threadType === 'directMessageThread') {
      sendDirectMessage({
        threadId: thread,
        messageType: 'draftjs',
        threadType,
        content: {
          body: JSON.stringify(toJSON(state)),
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
        messageType: 'draftjs',
        threadType,
        content: {
          body: JSON.stringify(toJSON(state)),
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

    // Also submit non-code messages on ENTER
    if (!this.state.code && !e.shiftKey) {
      return this.submit(e);
    }

    return 'not-handled';
  };

  removeMediaPreview = () => {
    this.setState({
      mediaPreview: '',
      mediaPreviewFile: null,
    });
  };

  sendMediaMessage = (file: Blob) => {
    this.removeMediaPreview();

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
    } = this.props;
    const {
      isFocused,
      photoSizeError,
      code,
      isSendingMediaMessage,
      mediaPreview,
    } = this.state;

    const networkDisabled =
      !networkOnline ||
      (websocketConnection !== 'connected' &&
        websocketConnection !== 'reconnected');

    return (
      <ChatInputWrapper focus={isFocused} onClick={this.triggerFocus}>
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
        {currentUser && (
          <MediaUploader
            isSendingMediaMessage={isSendingMediaMessage}
            currentUser={currentUser}
            onValidated={this.previewMedia}
            onError={this.setMediaMessageError}
            inputFocused={isFocused}
          />
        )}
        <IconButton
          glyph={'code'}
          onClick={this.toggleCodeMessage}
          tipText={'Write code'}
          tipLocation={'top'}
          style={{ margin: '0 4px' }}
          color={code ? 'brand.alt' : 'text.placeholder'}
          hoverColor={'brand.alt'}
        />
        <Form focus={isFocused}>
          <Input
            mediaPreview={mediaPreview}
            onRemoveMedia={this.removeMediaPreview}
            focus={isFocused}
            placeholder={`Your ${code ? 'code' : 'message'} here...`}
            editorState={state}
            handleReturn={this.handleReturn}
            onChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            code={code}
            editorRef={editor => (this.editor = editor)}
            editorKey="chat-input"
            decorators={[mentionsDecorator, linksDecorator]}
            networkDisabled={networkDisabled}
          />
          <SendButton
            data-cy="chat-input-send-button"
            glyph="send-fill"
            onClick={this.submit}
          />
        </Form>
      </ChatInputWrapper>
    );
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
  websocketConnection: state.connectionStatus.websocketConnection,
  networkOnline: state.connectionStatus.networkOnline,
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
