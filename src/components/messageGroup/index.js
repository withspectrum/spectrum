import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { convertTimestampToDate } from '../../helpers/utils';
import NewThreadShare from '../upsell/newThreadShare';
import Badge from '../badges';
import Avatar from '../avatar';
import Message from '../message';

import {
  Byline,
  Name,
  Wrapper,
  Timestamp,
  Time,
  Sender,
  MessageGroup,
} from './style';

export const AuthorAvatar = props => {
  const { sender } = props;

  return (
    <Avatar
      isOnline={sender.isOnline}
      src={sender.profilePhoto}
      username={sender.username}
      link={sender.username ? `/users/${sender.username}` : null}
      size={24}
    />
  );
};

export const AuthorByline = props => {
  const { me, sender } = props;

  return (
    <Byline>
      <Link to={`/users/${sender.username}`}>
        <Name>{me ? 'Me' : sender.name}</Name>
      </Link>
      {sender.contextPermissions &&
        sender.contextPermissions.isOwner && <Badge type="admin" />}
      {sender.contextPermissions &&
        sender.contextPermissions.isModerator && <Badge type="moderator" />}
      {sender.isPro && <Badge type="pro" />}
    </Byline>
  );
};
/*
  Messages expects to receive sorted and grouped messages.
  They will arrive as an array of arrays, where each top-level array is a group
  of message bubbles.

  This means we will need a nested map in order to get each group, and then within
  each group render each bubble.
*/
class Messages extends Component {
  render() {
    const {
      messages,
      currentUser,
      toggleReaction,
      threadType,
      threadId,
      thread,
      isModerator,
    } = this.props;

    const hash = window.location.hash.substr(1);
    const messagesExist = messages && messages.length !== 0;

    if (!messagesExist) {
      return <NewThreadShare thread={thread} />;
    }

    return (
      <Wrapper>
        {messages.map((group, i) => {
          // Since all messages in the group have the same sender and same initial timestamp, we only need to pull that data from the first message in the group. So let's get that message and then check who sent it.
          const initialMessage = group[0];
          const { sender } = initialMessage;

          const roboText = sender.id === 'robo';
          const me = currentUser ? sender.id === currentUser.id : false;
          const canModerate =
            threadType !== 'directMessageThread' && (me || isModerator);

          if (roboText) {
            return (
              <Timestamp key={initialMessage.message.content}>
                <hr />
                <Time>{convertTimestampToDate(initialMessage.timestamp)}</Time>
                <hr />
              </Timestamp>
            );
          }

          return (
            <Sender key={initialMessage.id} me={me}>
              {!me && !roboText && <AuthorAvatar sender={sender} />}
              <MessageGroup me={me}>
                <AuthorByline sender={sender} me={me} />
                {group.map(message => {
                  return (
                    <Message
                      key={message.id}
                      message={message}
                      link={`#${message.id}`}
                      reaction={'like'}
                      hash={hash}
                      me={me}
                      canModerate={canModerate}
                      pending={message.id < 0}
                      currentUser={currentUser}
                      threadType={threadType}
                      threadId={threadId}
                      toggleReaction={toggleReaction}
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
const ChatMessages = connect(mapStateToProps)(Messages);

export default ChatMessages;
