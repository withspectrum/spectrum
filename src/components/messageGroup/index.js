// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'src/components/link';
import { convertTimestampToDate } from '../../helpers/utils';
import Badge from '../badges';
import Avatar from '../avatar';
import Message from '../message';

import {
  Byline,
  Name,
  Username,
  Wrapper,
  Timestamp,
  Time,
  Sender,
  MessageGroup,
  UnseenRobotext,
  UnseenTime,
} from './style';

type SenderType = {
  isOnline: boolean,
  profilePhoto: string,
  username: string,
  name: string,
};

export const AuthorAvatar = ({
  sender,
  showProfile = false,
}: {
  sender: SenderType,
  showProfile?: boolean,
}) => {
  return (
    <Avatar
      user={sender}
      isOnline={sender.isOnline}
      src={sender.profilePhoto}
      username={sender.username}
      link={sender.username ? `/users/${sender.username}` : null}
      size="24"
      showProfile={showProfile}
    />
  );
};

export const AuthorByline = (props: { me: boolean, sender: SenderType }) => {
  const { sender } = props;

  return (
    <Byline>
      <Link to={`/users/${sender.username}`}>
        <Name>{sender.name}</Name>{' '}
        <Username>{sender.username && `@${sender.username}`}</Username>
      </Link>
      {sender.contextPermissions &&
        sender.contextPermissions.isOwner && <Badge type="admin" />}
      {sender.contextPermissions &&
        sender.contextPermissions.isModerator && <Badge type="moderator" />}
      {sender.isPro && <Badge type="pro" />}
    </Byline>
  );
};

type MessageType = Object; // TODO: Refine type

type MessageGroupType = Array<MessageType>;

type MessageGroupProps = {
  messages: Array<MessageGroupType>,
  currentUser: Object,
  threadType: string,
  threadId: string,
  thread: Object, // TODO: Refine type
  isModerator: boolean,
  toggleReaction: Function,
  dispatch: Function,
  selectedId: string,
  changeSelection: Function,
};

type State = {
  selectedMessage: ?string,
};

/*
  Messages expects to receive sorted and grouped messages.
  They will arrive as an array of arrays, where each top-level array is a group
  of message bubbles.

  This means we will need a nested map in order to get each group, and then within
  each group render each bubble.
*/
class Messages extends Component<MessageGroupProps, State> {
  constructor() {
    super();

    const hash = window.location.hash.substr(1);

    let initialSelection = null;

    if (hash && hash.length > 1) {
      initialSelection = hash;
    }

    this.state = {
      selectedMessage: initialSelection,
    };
  }

  shouldComponentUpdate(next, nextState) {
    const current = this.props;
    const newSelection =
      nextState.selectedMessage !== this.state.selectedMessage;

    if (newSelection) return true;

    // If it's a different thread, let's re-render
    const diffThread = next.threadId !== current.threadId;
    if (diffThread) return true;

    // If we don't have any message groups in the next props, return if we have
    // message groups in the current props
    if (!next.messages) return !current.messages;

    // If a message group was added
    if (next.messages.length !== current.messages.length) return true;

    // Check if any message group has different messages than last time
    const hasNewMessages = next.messages.some((nextGroup, groupIndex) => {
      const currGroup = current.messages[groupIndex];
      // New group or more messages in group
      if (!currGroup || nextGroup.length !== currGroup.length) return true;

      return nextGroup.some((nextMessage, messageIndex) => {
        const currMessage = current.messages[groupIndex][messageIndex];
        // A new message was added
        if (!currMessage) return false;

        return currMessage.id !== nextMessage.id;
      });
    });

    return hasNewMessages;
  }

  toggleSelectedMessage = messageId => {
    if (this.state.selectedMessage === messageId) {
      this.setState({
        selectedMessage: null,
      });
    } else {
      this.setState({
        selectedMessage: messageId,
      });
    }
  };

  render() {
    const {
      messages,
      currentUser,
      toggleReaction,
      threadType,
      threadId,
      isModerator,
    } = this.props;

    return (
      <Wrapper data-e2e-id="message-group">
        {messages.map((group, i) => {
          if (group.length === 0) return null;
          // Since all messages in the group have the same sender and same initial timestamp, we only need to pull that data from the first message in the group. So let's get that message and then check who sent it.
          if (group.length === 0) return null;
          const initialMessage = group[0];
          const { sender } = initialMessage;

          const roboText = sender.id === 'robo';
          const me = currentUser ? sender.id === currentUser.id : false;
          const canModerate =
            threadType !== 'directMessageThread' && (me || isModerator);

          if (roboText) {
            if (initialMessage.message.type === 'timestamp') {
              return (
                <Timestamp key={initialMessage.timestamp}>
                  <hr />
                  <Time>
                    {convertTimestampToDate(initialMessage.timestamp)}
                  </Time>
                  <hr />
                </Timestamp>
              );
            } else if (
              initialMessage.message.type === 'unseen-messages-below' &&
              messages[i + 1] &&
              messages[i + 1].length > 0 &&
              messages[i + 1][0].sender.id !== currentUser.id
            ) {
              return (
                <UnseenRobotext key={`unseen-${initialMessage.timestamp}`}>
                  <hr />
                  <UnseenTime>New messages</UnseenTime>
                  <hr />
                </UnseenRobotext>
              );
              // Ignore any unknown robo type messages
            } else {
              return null;
            }
          }

          return (
            <Sender key={initialMessage.id} me={me}>
              {!me && !roboText && <AuthorAvatar sender={sender} showProfile />}
              <MessageGroup me={me}>
                <AuthorByline sender={sender} me={me} />
                {group.map(message => {
                  return (
                    <Message
                      key={message.id}
                      message={message}
                      reaction={'like'}
                      me={me}
                      canModerate={canModerate}
                      pending={message.id < 0}
                      currentUser={currentUser}
                      threadType={threadType}
                      threadId={threadId}
                      toggleReaction={toggleReaction}
                      selectedId={this.state.selectedMessage}
                      changeSelection={this.toggleSelectedMessage}
                    />
                  );
                })}
              </MessageGroup>
            </Sender>
          );
        })}
      </Wrapper>
    );
  }
}

// get the current user from the store for evaulation of message bubbles
const mapStateToProps = state => ({ currentUser: state.users.currentUser });

// $FlowIssue
export default connect(mapStateToProps)(Messages);
