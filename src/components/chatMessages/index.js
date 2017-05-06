// @flow
import React from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import compose from 'recompose/compose';
import {
  convertTimestampToDate,
  convertTimestampToTime,
  onlyContainsEmoji,
} from '../../helpers/utils';
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
import { Bubble, EmojiBubble, ImgBubble } from '../bubbles';
import Icon from '../icons';
import { Reaction, Count } from '../bubbles/style';
import { toggleReaction } from './mutations';

/*
  ChatMessages expects to receive sorted and grouped messages.
  They will arrive as an array of arrays, where each top-level array is a group
  of message bubbles.

  This means we will need a nested map in order to get each group, and then within
  each group render each bubble.
*/
const ChatMessages = ({ messages, currentUser, mutate }) => {
  if (!messages) {
    return <div>No messages</div>;
  }

  const renderAvatar = (sender: Object, me: boolean) => {
    if (me) return;

    return (
      <AvatarLabel tipText={sender.displayName} tipLocation="right">
        <Avatar src={sender.photoURL} />
      </AvatarLabel>
    );
  };

  const renderBubbleHeader = (group: Object, me: boolean) => {
    const user = group.sender;

    // if type !== 'story' we don't show admin or pro badges because it clutters group messages
    return (
      <Byline me={me}>
        <Name>
          {me ? 'You' : user.displayName}
        </Name>
      </Byline>
    );
  };

  const renderReaction = (
    message: Object,
    sender: Object,
    me: boolean
  ): React$Element<any> => {
    const reactionUsers = message.reactions
      ? message.reactions.map(reaction => reaction.user.uid)
      : null;
    let reactionCount = message.reactions ? reactionUsers.length : 0;
    let userHasReacted =
      reactionUsers && reactionUsers.includes(currentUser.uid);
    // probably a better way to do this
    const doNothing = () => '';
    const triggerMutation = () => {
      return (
        mutate({
          variables: {
            reaction: {
              message: message.id,
              type: 'like',
            },
          },
        })
          // after the mutation occurs, it will either return an error or the new
          // story that was published
          .then(({ data }) => {
            console.log('reaction', data);
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
        hide={(me || currentUser.uid === null) && reactionCount === 0}
        onClick={
          me ? doNothing : triggerMutation
          // : () => toggleReaction(message.id, userHasReacted)
        }
      >
        <Icon icon={'like-active'} size={16} color={'text.reverse'} />
        <Count>{reactionCount}</Count>
      </Reaction>
    );
  };

  return (
    <Container>
      {messages.map((group, i) => {
        const evaluating = group[0];
        const roboText = evaluating.userId === 'robo';

        if (roboText) {
          const time = convertTimestampToDate(evaluating.message.content);
          return (
            <Timestamp key={i}>
              <Time>{time}</Time>
            </Timestamp>
          );
        }

        const sender = evaluating.sender;
        const me = sender.uid === currentUser.uid;

        return (
          <BubbleGroupContainer me={me} key={i}>
            {renderAvatar(sender, me)}

            <MessagesWrapper>
              {renderBubbleHeader(evaluating, me)}
              {group.map((message, i) => {
                if (
                  message.message.type === 'text' ||
                  message.message.type === 'emoji'
                ) {
                  const emojiOnly = onlyContainsEmoji(message.message.content);
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
                        message={message.message}
                        type={message.type}
                      />

                      {!emojiOnly && renderReaction(message, sender, me)}
                    </MessageWrapper>
                  );
                } else if (message.message.type === 'media') {
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
                        imgSrc={message.message.content.url}
                        message={message.message}
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
};

// get the current user from the store for evaulation of message bubbles
const mapStateToProps = state => ({ currentUser: state.users.currentUser });
const ConnectedChatMessages = connect(mapStateToProps)(ChatMessages);
// wrap the component in our mutations file which will handle reactions for now
const ChatMessagesWithMutations = compose(toggleReaction)(
  ConnectedChatMessages
);
export default ChatMessagesWithMutations;
