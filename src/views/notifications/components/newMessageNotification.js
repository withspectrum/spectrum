// @flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
import {
  parseActors,
  parseEvent,
  parseNotificationDate,
  parseContext,
} from '../utils';
import {
  convertTimestampToTime,
  onlyContainsEmoji,
} from '../../../helpers/utils';

import { ActorsRow } from './actorsRow';
import {
  CardLink,
  CardContent,
} from '../../../components/threadFeedCard/style';
import { Bubble, EmojiBubble, ImgBubble } from '../../../components/bubbles';
import Icon from '../../../components/icons';
import {
  MessagesWrapper,
  MessageWrapper,
  Byline,
  Name,
  AvatarLabel,
  UserAvatar,
} from '../../../components/chatMessages/style';
import { sortAndGroupNotificationMessages } from './sortAndGroupNotificationMessages';
import {
  BubbleGroupContainer,
  NotificationCard,
  TextContent,
  BubbleContainer,
  NotificationListRow,
  AttachmentsWash,
  SuccessContext,
  HzRule,
  Content,
} from '../style';

const renderBubbleHeader = (sender: Object, me: boolean) => {
  if (!sender.name) return;

  return (
    <Byline me={me}>
      <Link to={sender.username ? `/users/${sender.username}` : '/'}>
        <Name>{me ? 'You' : sender.name}</Name>
      </Link>
    </Byline>
  );
};

const renderAvatar = (sender: Object, me: boolean) => {
  if (me) return;

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

export const NewMessageNotification = ({ notification, currentUser }) => {
  const actors = parseActors(notification.actors, currentUser, false);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context, currentUser);
  const unsortedMessages = notification.entities.map(notif => notif.payload);
  const sortedMessages = sortAndGroupNotificationMessages(unsortedMessages);

  return (
    <NotificationCard>
      <CardLink
        to={{
          pathname: window.location.pathname,
          search: `?thread=${notification.context.id}`,
        }}
      />
      <CardContent>
        <SuccessContext>
          <Icon glyph="message-fill" />
          <ActorsRow actors={actors.asObjects} />
        </SuccessContext>
        <Content>
          <TextContent pointer={true}>
            {' '}
            {actors.asString} {event} {context.asString} {date}{' '}
          </TextContent>
          <AttachmentsWash>
            <HzRule>
              <hr />
              <Icon glyph="message" />
              <hr />
            </HzRule>
            {sortedMessages.map((group, i) => {
              const evaluating = group[0];
              let sender = actors.asObjects.filter(
                user => user.id === evaluating.senderId
              )[0];
              const me = currentUser ? sender.id === currentUser.id : false;

              return (
                <BubbleContainer me={me}>
                  <BubbleGroupContainer
                    style={{ marginTop: '16px' }}
                    me={me}
                    key={i}
                  >
                    {sender.profilePhoto && renderAvatar(sender, me)}

                    <MessagesWrapper>
                      {renderBubbleHeader(sender, me)}
                      {group.map((message, i) => {
                        if (
                          message.messageType === 'text' ||
                          message.messageType === 'emoji'
                        ) {
                          const emojiOnly = onlyContainsEmoji(
                            message.content.body
                          );
                          const TextBubble = emojiOnly ? EmojiBubble : Bubble;
                          return (
                            <MessageWrapper
                              me={me}
                              key={message.id}
                              timestamp={convertTimestampToTime(
                                message.timestamp
                              )}
                            >
                              <TextBubble
                                me={me}
                                persisted={message.persisted}
                                sender={sender}
                                message={message.content}
                                type={message.messageType}
                                pending={message.id < 0}
                              />
                            </MessageWrapper>
                          );
                        } else if (message.messageType === 'media') {
                          return (
                            <MessageWrapper
                              me={me}
                              key={message.id}
                              timestamp={convertTimestampToTime(
                                message.timestamp
                              )}
                            >
                              <ImgBubble
                                me={me}
                                persisted={message.persisted}
                                sender={sender}
                                imgSrc={message.content.body}
                                message={message.content}
                                openGallery={() =>
                                  this.toggleOpenGallery(message.id)}
                                pending={message.id < 0}
                              />
                            </MessageWrapper>
                          );
                        } else {
                          return <div key={i} />;
                        }
                      })}
                    </MessagesWrapper>
                  </BubbleGroupContainer>
                </BubbleContainer>
              );
            })}
          </AttachmentsWash>
        </Content>
      </CardContent>
    </NotificationCard>
  );
};

export const MiniNewMessageNotification = ({
  notification,
  currentUser,
  history,
}) => {
  const actors = parseActors(notification.actors, currentUser, true);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context, currentUser);

  return (
    <NotificationListRow>
      <CardLink
        to={{
          pathname: window.location.pathname,
          search: `?thread=${notification.context.id}`,
        }}
      />
      <CardContent>
        <SuccessContext>
          <Icon glyph="message-fill" />
          <ActorsRow actors={actors.asObjects} />
        </SuccessContext>
        <Content>
          <TextContent pointer={false}>
            {actors.asString} {event} {context.asString} {date}
          </TextContent>
        </Content>
      </CardContent>
    </NotificationListRow>
  );
};
