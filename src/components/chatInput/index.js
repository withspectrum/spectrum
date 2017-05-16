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
}) => {
  const submit = e => {
    e.preventDefault();
    sendMessage({
      thread,
      message: {
        type: 'text',
        content: value,
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
      <Form onSubmit={submit}>
        <Input
          ref="textInput"
          placeholder="Your message here..."
          type="text"
          value={value}
          onChange={onChange}
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
