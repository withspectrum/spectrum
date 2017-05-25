// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// // $FlowFixMe
import withState from 'recompose/withState';
// // $FlowFixMe
import withHandlers from 'recompose/withHandlers';
import Icon from '../icons';
import { toPlainText, fromPlainText } from '../../components/editor';
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

const ChatInputWithMutation = ({
  thread,
  sendMessage,
  state,
  onChange,
  clear,
  createThread,
  onFocus,
  onBlur,
}) => {
  const submit = e => {
    e.preventDefault();

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
      threadType: 'story',
      content: {
        body: toPlainText(state),
      },
    })
      .then(() => {
        // clear the input
        clear();
      })
      .catch(error => {
        console.log('Error sending message: ', error);
      });
  };

  const handleKeyPress = e => {
    if (e.keyCode === 13 && !e.shiftKey) {
      //=> make the enter key send a message, not create a new line in the next autoexpanding textarea unless shift is pressed.
      console.log('submit!');
      e.preventDefault(); //=> prevent linebreak
      submit(e); //=> send the message instead
    }
  };

  return (
    <ChatInputWrapper>
      <MediaInput
        ref="media"
        type="file"
        id="file"
        name="file"
        accept=".png, .jpg, .jpeg, .gif, .mp4"
      />

      <MediaLabel htmlFor="file">
        <Icon
          glyph="photo"
          tipLocation="top-right"
          tipText="Upload Photo"
          subtle
        />
      </MediaLabel>
      <EmojiToggle
        glyph="emoji"
        tipText="Insert Emoji"
        tipLocation="top-right"
      />
      <Form>
        <Input
          ref="textInput"
          placeholder="Your message here..."
          state={state}
          onKeyPress={handleKeyPress}
          onChange={onChange}
          markdown={false}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <SendButton glyph="send-fill" onClick={submit} />
      </Form>
    </ChatInputWrapper>
  );
};

const ChatInput = compose(
  sendMessageMutation,
  withState('state', 'changeState', fromPlainText('')),
  withHandlers({
    onChange: ({ changeState }) => state => changeState(state),
    clear: ({ changeState }) => () => changeState(fromPlainText('')),
  })
)(ChatInputWithMutation);

export default ChatInput;
