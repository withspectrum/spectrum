// @flow
import React from 'react';

const Messages = ({ messages }) => (
  <div>
    {messages.map(({ node }) => (
      <div key={node.id}>“{node.message.content}”</div>
    ))}
  </div>
);

export default Messages;
