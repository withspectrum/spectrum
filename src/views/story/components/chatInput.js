// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// // $FlowFixMe
import withState from 'recompose/withState';
// // $FlowFixMe
import withHandlers from 'recompose/withHandlers';
import { displayLoadingStateAsCard } from '../../../components/loading';
import { Card } from '../../../components/card';
import { sendMessageMutation } from '../mutations';

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
        clear();
      })
      .catch(error => {
        console.log('Error sending message: ', error);
      });
  };

  return (
    <Card>
      <form onSubmit={submit}>
        <input type="text" value={value} onChange={onChange} />
      </form>
    </Card>
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
