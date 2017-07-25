// @flow
import React from 'react';
import {
  parseActors,
  parseEvent,
  parseNotificationDate,
  parseContext,
} from '../utils';
import { ActorsRow } from './actorsRow';
import {
  NotificationCard,
  TextContent,
  BubbleGroupContainer,
  BubbleContainer,
  NotificationListRow,
  AttachmentsWash,
  ReactionContext,
  Content,
  HzRule,
} from '../style';
import Icon from '../../../components/icons';
import { ReactionWrapper } from '../../../components/reaction/style';
import { convertTimestampToTime, truncate } from '../../../helpers/utils';
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
  const actors = parseActors(notification.actors, currentUser, true);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);
  const message = notification.context.payload;

  return (
    <NotificationCard key={notification.id}>
      <CardLink to={`?thread=${notification.context.payload.threadId}`} />
      <CardContent>
        <ReactionContext>
          <Icon glyph="like-fill" />
          <ActorsRow actors={actors.asObjects} />
        </ReactionContext>
        <Content>
          <TextContent pointer={true}>
            {' '}{actors.asString} {event} {context.asString} {date}{' '}
          </TextContent>
          <AttachmentsWash>
            <HzRule>
              <hr />
              <Icon glyph="message" />
              <hr />
            </HzRule>
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
        </Content>
      </CardContent>
    </NotificationCard>
  );
};

export const MiniNewReactionNotification = ({
  notification,
  currentUser,
  history,
}) => {
  const actors = parseActors(notification.actors, currentUser, true);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);
  const isText = notification.context.payload.messageType === 'text';
  const messageStr = isText
    ? truncate(notification.context.payload.content.body, 40)
    : null;

  return (
    <NotificationListRow>
      <CardLink to={`?thread=${notification.context.payload.threadId}`} />
      <CardContent>
        <ReactionContext>
          <Icon glyph="like-fill" />
          <ActorsRow actors={actors.asObjects} />
        </ReactionContext>
        <Content>
          <TextContent pointer={false}>
            {' '}{actors.asString} {event} {context.asString}{' '}
            {messageStr && `"${messageStr}"`} {date}{' '}
          </TextContent>
        </Content>
      </CardContent>
    </NotificationListRow>
  );
};
