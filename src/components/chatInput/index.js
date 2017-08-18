// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import withState from 'recompose/withState';
// $FlowFixMe
import withHandlers from 'recompose/withHandlers';
// $FlowFixMe
import { connect } from 'react-redux';
import Icon from '../../components/icons';
import { track } from '../../helpers/events';
import { toPlainText, fromPlainText } from '../../components/editor';
import { addToastWithTimeout } from '../../actions/toasts';
import { openModal } from '../../actions/modals';
import {
  Form,
  EditorInput,
  ChatInputWrapper,
  SendButton,
  PhotoSizeError,
} from './style';
import { sendMessageMutation } from '../../api/message';
import {
  PRO_USER_MAX_IMAGE_SIZE_STRING,
  PRO_USER_MAX_IMAGE_SIZE_BYTES,
  FREE_USER_MAX_IMAGE_SIZE_BYTES,
  FREE_USER_MAX_IMAGE_SIZE_STRING,
} from '../../helpers/images';
import MediaInput from '../mediaInput';

class ChatInputWithMutation extends Component {
  state: {
    isFocused: boolean,
    photoSizeError: string,
  };

  constructor() {
    super();

    this.state = {
      isFocused: false,
      photoSizeError: '',
    };
  }

  submit = e => {
    e.preventDefault();

    const {
      state,
      thread,
      threadType,
      createThread,
      dispatch,
      sendMessage,
      clear,
      forceScrollToBottom,
    } = this.props;

    // This doesn't exist if this is a new conversation
    if (forceScrollToBottom) {
      // if a user sends a message, force a scroll to bottom
      forceScrollToBottom();
    }

    // If the input is empty don't do anything
    if (toPlainText(state).trim() === '') return;

    // user is creating a new directMessageThread, break the chain
    // and initiate a new group creation with the message being sent
    // in views/directMessages/containers/newThread.js
    if (thread === 'newDirectMessageThread') {
      return createThread({
        messageBody: toPlainText(state),
        messageType: 'text',
      });
    }

    // user is sending a message to an existing thread id - either a thread
    // or direct message thread
    sendMessage({
      threadId: thread,
      messageType: 'text',
      threadType,
      content: {
        body: toPlainText(state),
      },
    })
      .then(({ data: { addMessage } }) => {
        track(`${threadType} message`, 'text message created', null);
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });

    // refocus the input
    setTimeout(() => {
      clear();
      this.editor.focus();
    });
  };

  handleEnter = e => {
    //=> make the enter key send a message, not create a new line in the next autoexpanding textarea unless shift is pressed.
    e.preventDefault(); //=> prevent linebreak
    this.submit(e); //=> send the message instead
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

      this.props
        .sendMessage({
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
    const { state, onChange, currentUser, autoFocus } = this.props;
    const { isFocused, photoSizeError } = this.state;

    return (
      <ChatInputWrapper focus={isFocused}>
        {photoSizeError &&
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
          </PhotoSizeError>}
        <MediaInput onChange={this.sendMediaMessage} />
        <Form focus={isFocused}>
          <EditorInput
            focus={isFocused}
            placeholder="Your message here..."
            state={state}
            onEnter={this.handleEnter}
            onChange={onChange}
            markdown={false}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            singleLine
            images={false}
            editorRef={editor => (this.editor = editor)}
            autoFocus={autoFocus}
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
const ChatInput = compose(
  sendMessageMutation,
  withState('state', 'changeState', fromPlainText('')),
  withHandlers({
    onChange: ({ changeState }) => state => changeState(state),
    clear: ({ changeState }) => () => changeState(fromPlainText('')),
  }),
  connect(map),
  pure
)(ChatInputWithMutation);

export default ChatInput;
