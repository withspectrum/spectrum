// @flow
import React, { Component } from 'react';
import Messages from '../components/messages';
import Header from '../components/header';
import ChatInput from '../../../components/chatInput';
import { MessagesContainer, ViewContent } from '../style';

export const ExistingThread = ({ match, currentUser, groups }) => {
  /*
    If we are not composing a new thread, we need to get the right threadID
    to pass to the query that wraps this CirectMessagesChat component
  */
  const id = match.params.threadId;

  if (id !== 'new') {
    const group = groups.filter(group => group.node.id === id)[0].node;

    /*
      This should never happen, but in case a group wasn't selected
      return null
    */
    if (!group) {
      return null;
    }

    return (
      <MessagesContainer>
        <ViewContent>
          <Header group={group} currentUser={currentUser} />
          <Messages id={id} currentUser={currentUser} />
        </ViewContent>

        <ChatInput thread={match.params.threadId} />
      </MessagesContainer>
    );
  }

  /*
    if we are viewing /new we will handle the messages view in the composer
    component
  */
  return null;
};
