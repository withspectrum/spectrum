// @flow
import * as React from 'react';
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
  NotificationListRow,
  AttachmentsWash,
  ReactionContext,
  Content,
  HzRule,
} from '../style';
import Icon from '../../../components/icons';
import { truncate } from '../../../helpers/utils';
import { MessageGroupContainer } from '../../../components/messageGroup/style';
import Message from '../../../components/message';
import {
  CardLink,
  CardContent,
} from '../../../components/threadFeedCard/style';

type Props = {
  notification: Object,
  currentUser: Object,
  history: Object,
  markSingleNotificationSeen?: Function,
  markSingleNotificationAsSeenInState?: Function,
};

export const NewReactionNotification = ({
  notification,
  currentUser,
}: Props) => {
  const actors = parseActors(notification.actors, currentUser, true);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);
  const message = notification.context.payload;

  return (
    <NotificationCard key={notification.id}>
      <CardLink
        to={{
          pathname: window.location.pathname,
          search: `?thread=${notification.context.payload.threadId}`,
        }}
      />
      <CardContent>
        <ReactionContext>
          <Icon glyph="like-fill" />
          <ActorsRow actors={actors.asObjects} />
        </ReactionContext>
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

            <MessageGroupContainer>
              <Message
                message={message}
                link={`#${message.id}`}
                me={true}
                canModerate={false}
                pending={message.id < 0}
                currentUser={currentUser}
                context={'notification'}
              />
            </MessageGroupContainer>
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
}: Props) => {
  const actors = parseActors(notification.actors, currentUser, true);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);
  const isText = notification.context.payload.messageType === 'text';
  const messageStr = isText
    ? truncate(notification.context.payload.content.body, 40)
    : null;

  return (
    <NotificationListRow isSeen={notification.isSeen}>
      <CardLink
        to={{
          pathname: window.location.pathname,
          search: `?thread=${notification.context.payload.threadId}`,
        }}
      />
      <CardContent>
        <ReactionContext>
          <Icon glyph="like-fill" />
          <ActorsRow actors={actors.asObjects} />
        </ReactionContext>
        <Content>
          <TextContent pointer={false}>
            {' '}
            {actors.asString} {event} {context.asString}{' '}
            {messageStr && `"${messageStr}"`} {date}{' '}
          </TextContent>
        </Content>
      </CardContent>
    </NotificationListRow>
  );
};
