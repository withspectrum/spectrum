// @flow
import React from 'react';
import { sortAndGroupMessages } from '../../../helpers/messages';

const Messages = ({ messages }) => {
  const sortedMessages = sortAndGroupMessages(messages);
  console.log('back in the component', sortedMessages);
  return (
    <div>
      {sortedMessages.map(message => {
        console.log(message);
        return <div key={message.id}>“{message.message.content}”</div>;
      })}
    </div>
  );
};

export default Messages;
