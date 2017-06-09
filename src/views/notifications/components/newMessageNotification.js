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
import { Bubble } from '../../../components/bubbles';
import { convertTimestampToTime } from '../../../helpers/utils';
import {
  BubbleGroupContainer,
  MessagesWrapper,
  MessageWrapper,
} from '../../../components/chatMessages/style';
import {
  NotificationCard,
  TextContent,
  BubbleContainer,
  NotificationListRow,
  Timestamp,
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

  return (
    <NotificationCard>
      <CardLink to={`/thread/${notification.context.id}`} />
      <CardContent>
        <ActorsRow actors={actors.asObjects} />
        <TextContent pointer={true}>
          {actors.asString} {event} {date} {context.asString}
        </TextContent>
        <BubbleContainer me={false}>
          <BubbleGroupContainer me={false}>
            <MessagesWrapper>
              {notification.entities.length > 1 &&
                <MessageWrapper
                  me={false}
                  timestamp={convertTimestampToTime(message.timestamp)}
                >
                  <Bubble
                    me={false}
                    pending={false}
                    type={'thread'}
                    message={{
                      body: `+${notification.entities.length - 1} more...`,
                    }}
                  />
                </MessageWrapper>}

              <MessageWrapper
                me={false}
                timestamp={convertTimestampToTime(message.timestamp)}
              >
                <Bubble
                  me={false}
                  pending={false}
                  type={'thread'}
                  message={message.content}
                />
              </MessageWrapper>
            </MessagesWrapper>
          </BubbleGroupContainer>
        </BubbleContainer>
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
          {actors.asString} {event} {context.asString}
        </TextContent>
        <Timestamp>{date}</Timestamp>
      </CardContent>
    </NotificationListRow>
  );
};
