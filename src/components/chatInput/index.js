// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// // $FlowFixMe
import withState from 'recompose/withState';
// // $FlowFixMe
import withHandlers from 'recompose/withHandlers';
import Icon from '../icons';
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

const ChatInputWithMutation = ({
  thread,
  sendMessage,
  value,
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
      console.log('attempting to create a new thread');
      return createThread({
        messageBody: value,
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
        body: value,
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
    if (e.keyCode === 13) {
      //=> make the enter key send a message, not create a new line in the next autoexpanding textarea
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
          type="text"
          value={value}
          onChange={onChange}
          onKeyUp={handleKeyPress}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <SendButton glyph="send" onClick={submit} />
      </Form>
    </ChatInputWrapper>
  );
};

const ChatInput = compose(
  sendMessageMutation,
  withState('value', 'changeValue', ''),
  withHandlers({
    onChange: ({ changeValue }) => e => changeValue(e.target.value),
    clear: ({ changeValue }) => () => changeValue(''),
  })
)(ChatInputWithMutation);

export default ChatInput;
