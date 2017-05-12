// @flow
import React from 'react';
import styled from 'styled-components';
// $FlowFixMe
import compose from 'recompose/compose';
// // $FlowFixMe
import withState from 'recompose/withState';
// // $FlowFixMe
import withHandlers from 'recompose/withHandlers';
import { Card } from '../../../components/card';
import Editor, { toPlainText, fromPlainText } from '../../../components/editor';
import { sendMessageMutation } from '../mutations';

const InputEditor = styled(Editor)`
  width: 100%;
  height: 100%;
`;

const ChatInputWithMutation = ({
  thread,
  sendMessage,
  state,
  onChange,
  clear,
}) => {
  const submit = e => {
    e.preventDefault();
    sendMessage({
      thread,
      message: {
        type: 'text',
        content: toPlainText(state),
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
    <Card>
      <InputEditor
        state={state}
        onChange={onChange}
        markdown={false}
        onEnter={submit}
      />
    </Card>
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
