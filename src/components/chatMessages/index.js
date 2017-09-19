// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { Link } from 'react-router-dom';
import Icon from '../../components/icons';
import { openGallery } from '../../actions/gallery';
import {
  convertTimestampToDate,
  convertTimestampToTime,
  onlyContainsEmoji,
} from '../../helpers/utils';
import { NullState } from '../upsell';
import { Bubble, EmojiBubble, ImgBubble } from '../bubbles';
import Badge from '../badges';
import Reaction from '../reaction';

import {
  UserAvatar,
  AvatarLabel,
  Byline,
  Name,
  BubbleGroupContainer,
  Timestamp,
  Time,
  Container,
  MessagesWrapper,
  MessageWrapper,
  MessageLink,
  MessageNonLink,
  MessageTimestamp,
} from './style';

/*
  ChatMessages expects to receive sorted and grouped messages.
  They will arrive as an array of arrays, where each top-level array is a group
  of message bubbles.

  This means we will need a nested map in order to get each group, and then within
  each group render each bubble.
*/
class ChatMessages extends Component {
  toggleOpenGallery = messageId => {
    const { threadId } = this.props;
    this.props.dispatch(openGallery(threadId, messageId));
  };

  componentDidMount() {
    const hash = window.location.hash.substr(1);
    if (hash && hash.length > 1) {
      window.location.href = `#${hash}`;
    }
  }

  render() {
    const {
      messages,
      currentUser,
      toggleReaction,
      dispatch,
      threadType,
    } = this.props;
    const hash = window.location.hash.substr(1);

    if (!messages || messages.length === 0) {
      return (
        <NullState
          bg="chat"
          heading={`🔥 This thread is hot off the presses...`}
          copy={`Why don't you kick off the conversation?`}
        />
      );
    } else {
      const renderTimestamp = (me, message) => {
        if (threadType === 'directMessageThread') {
          return (
            <MessageNonLink me={me} className={'message-link'}>
              <MessageTimestamp className={'message-timestamp'}>
                {convertTimestampToTime(message.timestamp)}
              </MessageTimestamp>
            </MessageNonLink>
          );
        } else {
          return (
            <MessageLink
              me={me}
              className={'message-link'}
              href={`#${message.id}`}
            >
              <Icon glyph="link" size={16} />
              <MessageTimestamp className={'message-timestamp'}>
                {convertTimestampToTime(message.timestamp)}
              </MessageTimestamp>
            </MessageLink>
          );
        }
      };

      const renderAvatar = (sender: Object, me: boolean) => {
        const robo = sender.id === 'robo';
        if (me || robo) return;

        return (
          <AvatarLabel
            tipText={sender.name}
            tipLocation="right"
            style={{ alignSelf: 'flex-end' }}
          >
            <UserAvatar
              isOnline={sender.isOnline}
              src={sender.profilePhoto}
              username={sender.username}
              link={sender.username ? `/users/${sender.username}` : null}
            />
          </AvatarLabel>
        );
      };

      const renderBubbleHeader = (group: Object, me: boolean) => {
        const user = group.sender;
        return (
          <Byline me={me}>
            <Link to={`/users/${user.username}`}>
              <Name>{me ? 'You' : user.name}</Name>
            </Link>
            {user.isAdmin && <Badge type="admin" />}
            {user.isPro && <Badge type="pro" />}
          </Byline>
        );
      };

      return (
        <Container>
          {messages.map((group, i) => {
            const evaluating = group[0];
            const roboText = evaluating.sender.id === 'robo';
            if (roboText) {
              const time = convertTimestampToDate(evaluating.message.content);
              return (
                <Timestamp border={'2px solid'} color={'bg.wash'} key={i}>
                  <hr />
                  <Time>{time}</Time>
                  <hr />
                </Timestamp>
              );
            }

            const sender = evaluating.sender;
            const me = currentUser ? sender.id === currentUser.id : false;

            return (
              <BubbleGroupContainer me={me} key={i}>
                {renderAvatar(sender, me)}

                <MessagesWrapper>
                  {renderBubbleHeader(evaluating, me)}
                  {group.map((message, i) => {
                    if (
                      message.messageType === 'text' ||
                      message.messageType === 'emoji'
                    ) {
                      const emojiOnly = onlyContainsEmoji(message.content.body);
                      const TextBubble = emojiOnly ? EmojiBubble : Bubble;
                      return (
                        <MessageWrapper me={me} key={message.id}>
                          <a name={`${message.id}`} />
                          {renderTimestamp(me, message)}
                          <TextBubble
                            me={me}
                            persisted={message.persisted}
                            sender={sender}
                            message={message.content}
                            type={message.messageType}
                            pending={message.id < 0}
                            hashed={hash === message.id}
                          />

                          {/*
                            we check if typof equals a string to determine
                            if the message is coming from the server, or
                            generated via an optimistic response with apollo
                            (which has a typeof number)
                          */}
                          {!emojiOnly &&
                            typeof message.id === 'string' && (
                              <Reaction
                                message={message}
                                toggleReaction={toggleReaction}
                                me={me}
                                currentUser={currentUser}
                                dispatch={dispatch}
                              />
                            )}
                        </MessageWrapper>
                      );
                    } else if (message.messageType === 'media') {
                      return (
                        <MessageWrapper me={me} key={message.id}>
                          <a name={`${message.id}`} />
                          {renderTimestamp(me, message)}
                          <ImgBubble
                            me={me}
                            persisted={message.persisted}
                            sender={sender}
                            imgSrc={message.content.body}
                            message={message.content}
                            openGallery={() =>
                              this.toggleOpenGallery(message.id)}
                            pending={message.id < 0}
                            hashed={hash === message.id}
                          />
                          {typeof message.id === 'string' && (
                            <Reaction
                              message={message}
                              toggleReaction={toggleReaction}
                              me={me}
                              currentUser={currentUser}
                              dispatch={dispatch}
                            />
                          )}
                        </MessageWrapper>
                      );
                    } else {
                      return <div key={i} />;
                    }
                  })}
                </MessagesWrapper>
              </BubbleGroupContainer>
            );
          })}
        </Container>
      );
    }
  }
}

// get the current user from the store for evaulation of message bubbles
const mapStateToProps = state => ({ currentUser: state.users.currentUser });
const ConnectedChatMessages = connect(mapStateToProps)(ChatMessages);

export default ConnectedChatMessages;
