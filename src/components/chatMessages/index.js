// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { openModal } from '../../actions/modals';
import { openGallery } from '../../actions/gallery';
import {
  convertTimestampToDate,
  convertTimestampToTime,
  onlyContainsEmoji,
} from '../../helpers/utils';
import { track } from '../../helpers/events';
import { NullState } from '../upsell';
import { Bubble, EmojiBubble, ImgBubble } from '../bubbles';
import Badge from '../badges';
import Icon from '../icons';
import { Reaction, Count } from '../bubbles/style';

import {
  Avatar,
  AvatarLabel,
  Byline,
  Name,
  BubbleGroupContainer,
  Timestamp,
  Time,
  Container,
  MessagesWrapper,
  MessageWrapper,
} from './style';

/*
  ChatMessages expects to receive sorted and grouped messages.
  They will arrive as an array of arrays, where each top-level array is a group
  of message bubbles.

  This means we will need a nested map in order to get each group, and then within
  each group render each bubble.
*/
class ChatMessages extends Component {
  openGallery = messageId => {
    const { threadId } = this.props;
    this.props.dispatch(openGallery(threadId, messageId));
  };

  render() {
    const { messages, currentUser, toggleReaction, dispatch } = this.props;

    if (!messages) {
      return (
        <NullState
          bg="chat"
          heading={`🔥 This thread is hot off the presses...`}
          copy={`Why don't you kick off the conversation?`}
        />
      );
    } else {
      const openUserProfileModal = (user: Object) => {
        return dispatch(openModal('USER_PROFILE_MODAL', { user }));
      };

      const renderAvatar = (sender: Object, me: boolean) => {
        const robo = sender.id === 'robo';
        if (me || robo) return;

        return (
          <Link
            to={`/users/${sender.username}`}
            style={{ alignSelf: 'flex-end' }}
          >
            <AvatarLabel tipText={sender.name} tipLocation="right">
              <Avatar src={sender.profilePhoto} />
            </AvatarLabel>
          </Link>
        );
      };

      const renderBubbleHeader = (group: Object, me: boolean) => {
        const user = group.sender;

        return (
          <Byline me={me}>
            <Link to={`/users/${user.username}`}>
              <Name>
                {me ? 'You' : user.name}
              </Name>
              {user.isAdmin && <Badge type="admin" />}
              {user.isPro && <Badge type="pro" />}
            </Link>
          </Byline>
        );
      };

      const renderReaction = (
        message: Object,
        sender: Object,
        me: boolean
      ): React$Element<any> => {
        const reactionUsers = message.reactions
          ? message.reactions.map(reaction => reaction.user.id)
          : null;
        let reactionCount = message.reactions && reactionUsers
          ? reactionUsers.length
          : 0;
        let userHasReacted = currentUser
          ? reactionUsers && reactionUsers.includes(currentUser.id)
          : false;
        // probably a better way to do this

        const doNothing = () => '';
        const triggerMutation = () => {
          track('reaction', userHasReacted ? 'removed' : 'created', null);

          return (
            toggleReaction({
              messageId: message.id,
              type: 'like',
            })
              // after the mutation occurs, it will either return an error or the new
              // thread that was published
              .then(({ data }) => {
                // can do something with the returned reaction here
              })
              .catch(error => {
                // TODO add some kind of dispatch here to show an error to the user
                console.log('error toggling reaction', error);
              })
          );
        };

        return (
          <Reaction
            hasCount={reactionCount}
            active={userHasReacted}
            me={me}
            hide={(me || !currentUser) && reactionCount === 0}
            onClick={
              me ? doNothing : triggerMutation
              // : () => toggleReaction(message.id, userHasReacted)
            }
          >
            <Icon glyph="like-fill" size={16} color={'text.reverse'} />
            <Count>{reactionCount}</Count>
          </Reaction>
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
                        <MessageWrapper
                          me={me}
                          key={message.id}
                          timestamp={convertTimestampToTime(message.timestamp)}
                        >
                          <TextBubble
                            me={me}
                            persisted={message.persisted}
                            sender={sender}
                            message={message.content}
                            type={message.messageType}
                          />

                          {!emojiOnly && renderReaction(message, sender, me)}
                        </MessageWrapper>
                      );
                    } else if (message.messageType === 'media') {
                      return (
                        <MessageWrapper
                          me={me}
                          key={message.id}
                          timestamp={convertTimestampToTime(message.timestamp)}
                        >
                          <ImgBubble
                            me={me}
                            persisted={message.persisted}
                            sender={sender}
                            imgSrc={message.content.body}
                            message={message.content}
                            openGallery={() => this.openGallery(message.id)}
                          />
                          {renderReaction(message, sender, me)}
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
