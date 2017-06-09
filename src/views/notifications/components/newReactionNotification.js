// @flow
import React from 'react';
import { parseActors, parseEvent, parseNotificationDate } from '../utils';
import { ActorsRow } from './actorsRow';
import {
  NotificationCard,
  TextContent,
  BubbleContainer,
  Timestamp,
  NotificationListRow,
} from '../style';
import Icon from '../../../components/icons';
import { ReactionWrapper } from '../../../components/reaction/style';
import { convertTimestampToTime } from '../../../helpers/utils';
import {
  BubbleGroupContainer,
  MessagesWrapper,
  MessageWrapper,
} from '../../../components/chatMessages/style';
import { Bubble } from '../../../components/bubbles';

export const NewReactionNotification = ({ notification, currentUser }) => {
  const actors = parseActors(notification.actors, currentUser);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);

  return (
    <NotificationCard key={notification.id}>
      <ActorsRow actors={actors.asObjects} />
      <TextContent>{actors.asString} {event} {date}</TextContent>
      <BubbleContainer me={true}>
        <BubbleGroupContainer me={true}>
          <MessagesWrapper>
            <MessageWrapper
              me={true}
              timestamp={convertTimestampToTime(
                notification.context.payload.timestamp
              )}
            >
              <Bubble
                me={true}
                pending={false}
                type={'thread'}
                message={notification.context.payload.content}
              />
              <ReactionWrapper
                hasCount={true}
                active={true}
                me={true}
                hide={false}
                dummy={true}
              >
                <Icon glyph="like-fill" size={16} color={'text.reverse'} />
              </ReactionWrapper>
            </MessageWrapper>
          </MessagesWrapper>
        </BubbleGroupContainer>
      </BubbleContainer>
    </NotificationCard>
  );
};

export const MiniNewReactionNotification = ({
  notification,
  currentUser,
  history,
}) => {
  const actors = parseActors(notification.actors, currentUser);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);

  return (
    <NotificationListRow
      onClick={() =>
        history.push(`/thread/${notification.context.payload.threadId}`)}
    >
      <ActorsRow actors={actors.asObjects} />
      <TextContent>
        {actors.asString} {event}
      </TextContent>
      <Timestamp>{date}</Timestamp>
    </NotificationListRow>
  );
};
