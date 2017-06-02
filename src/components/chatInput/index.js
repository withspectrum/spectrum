// @flow
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
// $FlowFixMe
import compose from 'recompose/compose';
// // $FlowFixMe
import withState from 'recompose/withState';
// // $FlowFixMe
import withHandlers from 'recompose/withHandlers';
// // $FlowFixMe
import { connect } from 'react-redux';
import Icon from '../icons';
import { track } from '../../helpers/events';
import { toPlainText, fromPlainText } from '../../components/editor';
import { addToastWithTimeout } from '../../actions/toasts';
import {
  Form,
  Input,
  ChatInputWrapper,
  MediaInput,
  MediaLabel,
  EmojiToggle,
  SendButton,
} from './style';
import { sendMessageMutation } from '../../api/message';

// const InputEditor = styled(Editor)`
//   width: 100%;
//   height: 100%;
// `;

class ChatInputWithMutation extends Component {
  submit = e => {
    e.preventDefault();
    const {
      state,
      thread,
      threadType,
      createThread,
      refetchThread,
      clear,
      dispatch,
      sendMessage,
    } = this.props;
    const input = findDOMNode(this.refs.chatInput);
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

    if (threadType === 'directMessageThread') {
      refetchThread();
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
      .then(() => {
        // clear the input
        clear();
        // refocus the input
        input.focus();

        track(`${threadType} message`, 'text message created', null);
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  handleEnter = e => {
    //=> make the enter key send a message, not create a new line in the next autoexpanding textarea unless shift is pressed.
    e.preventDefault(); //=> prevent linebreak
    this.submit(e); //=> send the message instead
  };

  sendMediaMessage = e => {
    const file = e.target.files[0];
    const { thread, threadType, createThread, clear, dispatch } = this.props;
    console.log(threadType);
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
          body: '',
        },
        file,
      })
      .then(({ sendMessage }) => {
        clear();
        track(`${threadType} message`, 'media message created', null);
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { state, onFocus, onBlur, onChange } = this.props;
    return (
      <ChatInputWrapper>
        <MediaInput
          type="file"
          id="file"
          name="file"
          accept=".png, .jpg, .jpeg, .gif, .mp4"
          multiple={false}
          onChange={this.sendMediaMessage}
        />

        <MediaLabel htmlFor="file">
          <Icon
            glyph="photo"
            tipLocation="top-right"
            tipText="Upload Photo"
            subtle
          />
        </MediaLabel>
        {/* <EmojiToggle
          glyph="emoji"
          tipText="Insert Emoji"
          tipLocation="top-right"
        /> */}
        <Form>
          <Input
            placeholder="Your message here..."
            state={state}
            onEnter={this.handleEnter}
            onChange={onChange}
            markdown={false}
            onFocus={onFocus}
            onBlur={onBlur}
            singleLine
            ref={'chatInput'}
          />
          <SendButton glyph="send-fill" onClick={this.submit} />
        </Form>
      </ChatInputWrapper>
    );
  }
}

const ChatInput = compose(
  sendMessageMutation,
  withState('state', 'changeState', fromPlainText('')),
  withHandlers({
    onChange: ({ changeState }) => state => changeState(state),
    clear: ({ changeState }) => () => changeState(fromPlainText('')),
  }),
  connect()
)(ChatInputWithMutation);

export default ChatInput;
