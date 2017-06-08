// @flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { parseActors, parseEvent, parseNotificationDate } from '../utils';
import {
  NotificationCard,
  ActorPhotosContainer,
  ActorPhotoItem,
  ActorPhoto,
  TextContent,
  BubbleContainer,
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
