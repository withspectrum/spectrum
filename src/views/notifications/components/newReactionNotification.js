// @flow
import React from 'react';
import { parseActors, parseEvent, parseNotificationDate } from '../utils';
import { ActorsRow } from './actorsRow';
import {
  NotificationCard,
  TextContent,
  BubbleGroupContainer,
  BubbleContainer,
  Timestamp,
  NotificationListRow,
  AttachmentsWash,
} from '../style';
import Icon from '../../../components/icons';
import { ReactionWrapper } from '../../../components/reaction/style';
import { convertTimestampToTime } from '../../../helpers/utils';
import {
  MessagesWrapper,
  MessageWrapper,
} from '../../../components/chatMessages/style';
import { Bubble, ImgBubble } from '../../../components/bubbles';
import {
  CardLink,
  CardContent,
} from '../../../components/threadFeedCard/style';

export const NewReactionNotification = ({ notification, currentUser }) => {
  const actors = parseActors(notification.actors, currentUser);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const message = notification.context.payload;

  return (
    <NotificationCard key={notification.id}>
      <CardLink to={`/thread/${notification.context.payload.threadId}`} />
      <CardContent>
        <ActorsRow actors={actors.asObjects} />
        <TextContent pointer={true}>{actors.asString} {event}.</TextContent>
        <Timestamp>{date}</Timestamp>
        <AttachmentsWash>
          <BubbleContainer me={true}>
            <BubbleGroupContainer me={true}>
              <MessagesWrapper>
                {message.messageType === 'text' &&
                  <MessageWrapper
                    me={false}
                    timestamp={convertTimestampToTime(message.timestamp)}
                  >
                    <Bubble
                      me={true}
                      pending={false}
                      type={'thread'}
                      message={message.content}
                    />
                    <ReactionWrapper
                      hasCount={true}
                      active={true}
                      me={true}
                      hide={false}
                      dummy={true}
                    >
                      <Icon
                        glyph="like-fill"
                        size={16}
                        color={'text.reverse'}
                      />
                    </ReactionWrapper>
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
                    <ReactionWrapper
                      hasCount={true}
                      active={true}
                      me={true}
                      hide={false}
                      dummy={true}
                    >
                      <Icon
                        glyph="like-fill"
                        size={16}
                        color={'text.reverse'}
                      />
                    </ReactionWrapper>
                  </MessageWrapper>}
              </MessagesWrapper>
            </BubbleGroupContainer>
          </BubbleContainer>
        </AttachmentsWash>
      </CardContent>
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
      <TextContent pointer={false}>
        {actors.asString} {event}.
      </TextContent>
      <Timestamp>{date}</Timestamp>
    </NotificationListRow>
  );
};
