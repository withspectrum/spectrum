// @flow
import React from 'react';
import { sortAndGroupMessages } from '../../../helpers/messages';
import ChatMessages from '../../../components/chatMessages';

const Messages = ({ messages }) => {
  const sortedMessages = sortAndGroupMessages(messages);
  return <ChatMessages message={sortedMessages} />;
};

export default Messages;
