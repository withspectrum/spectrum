// @flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
import {
  parseActors,
  parseEvent,
  parseNotificationDate,
  parseContext,
  getLastMessageCreatedByAnotherUser,
} from '../utils';
import { Bubble } from '../../../components/bubbles';
import { convertTimestampToTime } from '../../../helpers/utils';
import {
  BubbleGroupContainer,
  MessagesWrapper,
  MessageWrapper,
} from '../../../components/chatMessages/style';
import {
  NotificationCard,
  ActorPhotosContainer,
  ActorPhotoItem,
  ActorPhoto,
  TextContent,
  BubbleContainer,
} from '../style';

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
    <NotificationCard key={notification.id}>
      <ActorPhotosContainer>
        {actors.asObjects.map(actor => {
          return (
            <ActorPhotoItem key={actor.id}>
              <Link to={`/users/${actor.username}`}>
                <ActorPhoto src={actor.profilePhoto} />
              </Link>
            </ActorPhotoItem>
          );
        })}
      </ActorPhotosContainer>
      <TextContent>
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
    </NotificationCard>
  );
};
