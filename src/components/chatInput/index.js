import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import withState from 'recompose/withState';
// $FlowFixMe
import withHandlers from 'recompose/withHandlers';
// $FlowFixMe
import { connect } from 'react-redux';
import changeCurrentBlockType from 'draft-js-markdown-plugin/lib/modifiers/changeCurrentBlockType';
import { KeyBindingUtil } from 'draft-js';
import Icon from '../../components/icons';
import { IconButton } from '../../components/buttons';
import { track } from '../../helpers/events';
import { toJSON, fromPlainText, toPlainText } from 'shared/draft-utils';
import { addToastWithTimeout } from '../../actions/toasts';
import { openModal } from '../../actions/modals';
import { Form, ChatInputWrapper, SendButton, PhotoSizeError } from './style';
import Input from './input';
import {
  sendMessageMutation,
  sendDirectMessageMutation,
} from '../../api/message';
import {
  PRO_USER_MAX_IMAGE_SIZE_STRING,
  PRO_USER_MAX_IMAGE_SIZE_BYTES,
  FREE_USER_MAX_IMAGE_SIZE_BYTES,
  FREE_USER_MAX_IMAGE_SIZE_STRING,
} from '../../helpers/images';
import MediaInput from '../mediaInput';

class ChatInput extends Component {
  state: {
    isFocused: boolean,
    photoSizeError: string,
  };

  constructor() {
    super();

    this.state = {
      isFocused: false,
      photoSizeError: '',
      code: false,
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  shouldComponentUpdate(next) {
    const curr = this.props;

    // User changed
    if (curr.currentUser !== next.currentUser) return true;

    // State changed
    if (curr.state !== next.state) return true;

    return false;
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  triggerFocus = () => {
    this.editor.focus();
  };

  toggleCodeMessage = () => {
    const { onChange, state } = this.props;
    const { code } = this.state;
    this.setState(
      {
        code: !code,
      },
      () => {
        onChange(
          changeCurrentBlockType(state, code ? 'unstyled' : 'code-block', '')
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
    } = this.props;

    // This doesn't exist if this is a new conversation
    if (forceScrollToBottom) {
      // if a user sends a message, force a scroll to bottom
      forceScrollToBottom();
    }

    // If the input is empty don't do anything
    if (toPlainText(state).trim() === '') return 'handled';

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
        .then(({ data: { addMessage } }) => {
          track(`${threadType} message`, 'text message created', null);
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
        .then(({ data: { addMessage } }) => {
          track(`${threadType} message`, 'text message created', null);
        })
        .catch(err => {
          dispatch(addToastWithTimeout('error', err.message));
        });
    }

    // refocus the input
    setTimeout(() => {
      clear();
      this.editor.focus();
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

  sendMediaMessage = e => {
    let reader = new FileReader();
    const file = e.target.files[0];
    const {
      thread,
      threadType,
      createThread,
      dispatch,
      forceScrollToBottom,
      sendDirectMessage,
      sendMessage,
    } = this.props;

    if (!file) return;

    reader.readAsDataURL(file);

    if (
      file &&
      file.size > FREE_USER_MAX_IMAGE_SIZE_BYTES &&
      !this.props.currentUser.isPro
    ) {
      return this.setState({
        photoSizeError: `Upgrade to Pro to upload files up to ${PRO_USER_MAX_IMAGE_SIZE_STRING}. Otherwise, try uploading a photo less than ${FREE_USER_MAX_IMAGE_SIZE_STRING}.`,
      });
    }

    if (
      file &&
      file.size > PRO_USER_MAX_IMAGE_SIZE_BYTES &&
      this.props.currentUser.isPro
    ) {
      return this.setState({
        photoSizeError: `Try uploading a file less than ${PRO_USER_MAX_IMAGE_SIZE_STRING}.`,
      });
    }

    this.setState({
      photoSizeError: '',
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
          .then(({ addMessage }) => {
            track(`${threadType} message`, 'media message created', null);
          })
          .catch(err => {
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
          .then(({ addMessage }) => {
            track(`${threadType} message`, 'media message created', null);
          })
          .catch(err => {
            dispatch(addToastWithTimeout('error', err.message));
          });
      }
    };
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

  render() {
    const { state, onChange, currentUser } = this.props;
    const { isFocused, photoSizeError, code } = this.state;

    return (
      <ChatInputWrapper focus={isFocused} onClick={this.triggerFocus}>
        {photoSizeError && (
          <PhotoSizeError>
            <p
              onClick={() =>
                this.props.dispatch(
                  openModal('UPGRADE_MODAL', { user: currentUser })
                )}
            >
              {photoSizeError}
            </p>
            <Icon
              onClick={() => this.setState({ photoSizeError: '' })}
              glyph="view-close"
              size={16}
              color={'warn.default'}
            />
          </PhotoSizeError>
        )}
        <MediaInput onChange={this.sendMediaMessage} />
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
            focus={isFocused}
            placeholder={`Your ${code ? 'code' : 'message'} here...`}
            editorState={state}
            handleReturn={this.handleReturn}
            onChange={onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            code={code}
            editorRef={editor => (this.editor = editor)}
            editorKey="chat-input"
          />
          <SendButton glyph="send-fill" onClick={this.submit} />
        </Form>
      </ChatInputWrapper>
    );
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
});
export default compose(
  sendMessageMutation,
  sendDirectMessageMutation,
  withState('state', 'changeState', fromPlainText('')),
  withHandlers({
    onChange: ({ changeState }) => state => changeState(state),
    clear: ({ changeState }) => () => changeState(fromPlainText('')),
  }),
  connect(map)
)(ChatInput);
