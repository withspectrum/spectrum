// @flow
import React from 'react';
import { NullMessagesWrapper, NullCopy, Stretch } from '../style';

const NullMessages = () => (
  <Stretch>
    <NullMessagesWrapper>
      <NullCopy>No messages yet</NullCopy>
    </NullMessagesWrapper>
  </Stretch>
);

export default NullMessages;
