// @flow
import React, { Component, Fragment } from 'react';
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
  Author,
  MessageGroup,
  UnseenRobotext,
  UnseenTime,
} from './style';

export const AuthorAvatar = ({
  user,
  showProfile = false,
}: {
  user: Object,
  showProfile?: boolean,
}) => {
  return (
    <Avatar
      user={user}
      isOnline={user.isOnline}
      src={user.profilePhoto}
      username={user.username}
      link={user.username ? `/users/${user.username}` : null}
      size="24"
      showProfile={showProfile}
    />
  );
};

export const AuthorByline = (props: {
  me: boolean,
  user: Object,
  roles?: Array<string>,
}) => {
  const { user, roles } = props;
  return (
    <Byline>
      <Link to={`/users/${user.username}`}>
        <Name>{user.name}</Name>{' '}
        <Username>{user.username && `@${user.username}`}</Username>
      </Link>
      {roles && roles.map((role, index) => <Badge type={role} key={index} />)}
      {user.isPro && <Badge type="pro" />}
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
  lastSeen?: number | Date,
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
      lastSeen,
    } = this.props;

    let hasInjectedUnseenRobo;
    return (
      <Wrapper data-cy="message-group">
        {messages.map((group, i) => {
          if (group.length === 0) return null;
          // Since all messages in the group have the same Author and same initial timestamp, we only need to pull that data from the first message in the group. So let's get that message and then check who sent it.
          if (group.length === 0) return null;
          const initialMessage = group[0];
          const { author } = initialMessage;

          const roboText = author.user.id === 'robo';
          const me = currentUser
            ? author.user && author.user.id === currentUser.id
            : false;
          const canModerate = threadType !== (me || isModerator);

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
            } else {
              // Ignore unknown robo messages
              return null;
            }
          }

          let unseenRobo = null;
          // If the last message in the group was sent after the thread was seen mark the entire
          // group as last seen in the UI
          // NOTE(@mxstbr): Maybe we should split the group eventually
          if (
            !!lastSeen &&
            new Date(group[group.length - 1].timestamp).getTime() >
              new Date(lastSeen).getTime() &&
            !me &&
            !hasInjectedUnseenRobo
          ) {
            hasInjectedUnseenRobo = true;
            unseenRobo = (
              <UnseenRobotext key={`unseen${initialMessage.timestamp}`}>
                <hr />
                <UnseenTime>New messages</UnseenTime>
                <hr />
              </UnseenRobotext>
            );
          }

          return (
            <Fragment key={initialMessage.id}>
              {unseenRobo}
              <Author key={initialMessage.id} me={me}>
                {!me &&
                  !roboText && (
                    <AuthorAvatar
                      user={author.user}
                      roles={author.roles}
                      showProfile
                    />
                  )}
                <MessageGroup me={me}>
                  <AuthorByline
                    user={author.user}
                    roles={author.roles}
                    me={me}
                  />
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
              </Author>
            </Fragment>
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
