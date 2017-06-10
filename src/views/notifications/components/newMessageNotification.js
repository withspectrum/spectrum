// @flow
import React from 'react';
import {
  parseActors,
  parseEvent,
  parseNotificationDate,
  parseContext,
  getLastMessageCreatedByAnotherUser,
} from '../utils';
import { ActorsRow } from './actorsRow';
import { Bubble, EmojiBubble, ImgBubble } from '../../../components/bubbles';
import {
  convertTimestampToTime,
  onlyContainsEmoji,
} from '../../../helpers/utils';
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
} from '../style';
import {
  CardLink,
  CardContent,
} from '../../../components/threadFeedCard/style';

export const NewMessageNotification = ({ notification, currentUser }) => {
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

  console.log(message.messageType);

  return (
    <NotificationCard>
      <CardLink to={`/thread/${notification.context.id}`} />
      <CardContent>
        <ActorsRow actors={actors.asObjects} />
        <TextContent pointer={true}>
          {actors.asString} {event} {context.asString}.
        </TextContent>
        <Timestamp>{date}</Timestamp>
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
