// @flow
import React from 'react';
import {
  parseActors,
  parseEvent,
  parseNotificationDate,
  parseContext,
  getLastMessageCreatedByAnotherUser,
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
} from '../../../components/chatMessages/style';
import {
  BubbleGroupContainer,
  NotificationCard,
  TextContent,
  BubbleContainer,
  NotificationListRow,
  Timestamp,
  AttachmentsWash,
  ContextRow,
} from '../style';

export const NewMessageNotification = ({ notification, currentUser }) => {
  console.log('raw notif', notification);
  const actors = parseActors(notification.actors, currentUser);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);
  const message = getLastMessageCreatedByAnotherUser(
    notification.entities,
    currentUser
  );
  const emojiOnly = onlyContainsEmoji(message.content.body);
  const TextBubble = emojiOnly ? EmojiBubble : Bubble;

  console.log('context', context);
  console.log('actors', actors);

  return (
    <NotificationCard>
      <CardLink to={`/thread/${notification.context.id}`} />
      <CardContent>
        <ContextRow>
          <Icon glyph="message-fill" />
          <TextContent pointer={true}>
            {actors.asString} {event} {context.asString} {date}
          </TextContent>
        </ContextRow>
        <AttachmentsWash>
          <BubbleContainer me={false}>
            <BubbleGroupContainer me={false}>
              <MessagesWrapper>

                {message.messageType !== 'media' &&
                  <MessageWrapper
                    me={false}
                    timestamp={convertTimestampToTime(message.timestamp)}
                  >
                    <TextBubble
                      me={false}
                      pending={false}
                      message={message.content}
                    />
                  </MessageWrapper>}
                {message.messageType === 'media' &&
                  <MessageWrapper
                    me={false}
                    timestamp={convertTimestampToTime(message.timestamp)}
                  >
                    <ImgBubble
                      me={false}
                      pending={false}
                      imgSrc={message.content.body}
                      message={message.content}
                    />
                  </MessageWrapper>}

              </MessagesWrapper>
            </BubbleGroupContainer>
          </BubbleContainer>
          <ActorsRow actors={actors.asObjects} />
        </AttachmentsWash>
      </CardContent>
    </NotificationCard>
  );
};

export const MiniNewMessageNotification = ({
  notification,
  currentUser,
  history,
}) => {
  const actors = parseActors(notification.actors, currentUser);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);

  return (
    <NotificationListRow
      onClick={() => history.push(`/thread/${notification.context.id}`)}
    >
      <CardLink to={`/thread/${notification.context.id}`} />
      <CardContent>
        <ActorsRow actors={actors.asObjects} />
        <TextContent pointer={false}>
          {actors.asString} {event} {context.asString}.
        </TextContent>
        <Timestamp>{date}</Timestamp>
      </CardContent>
    </NotificationListRow>
  );
};
