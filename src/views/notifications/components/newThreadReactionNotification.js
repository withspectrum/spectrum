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
  NotificationListRow,
  ThreadReactionContext,
  Content,
} from '../style';
import Icon from '../../../components/icons';
import { truncate } from '../../../helpers/utils';
import {
  CardLink,
  CardContent,
} from '../../../components/threadFeedCard/style';

export const NewThreadReactionNotification = ({
  notification,
  currentUser,
}) => {
  const actors = parseActors(notification.actors, currentUser, true);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(
    { ...notification.context, type: 'THREAD_REACTION' },
    currentUser
  );

  return (
    <NotificationCard key={notification.id}>
      <CardLink
        to={{
          pathname: window.location.pathname,
          search: `?thread=${notification.context.payload.id}`,
        }}
      />
      <CardContent>
        <ThreadReactionContext>
          <Icon glyph="thumbsup-fill" />
          <ActorsRow actors={actors.asObjects} />
        </ThreadReactionContext>
        <Content>
          <TextContent pointer={true}>
            {' '}
            {actors.asString} {event} {context.asString} {date}{' '}
          </TextContent>
        </Content>
      </CardContent>
    </NotificationCard>
  );
};

export const MiniNewThreadReactionNotification = ({
  notification,
  currentUser,
  history,
}) => {
  const actors = parseActors(notification.actors, currentUser, true);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(
    { ...notification.context, type: 'THREAD_REACTION' },
    currentUser
  );
  const isText = notification.context.payload.messageType === 'text';
  const messageStr = isText
    ? truncate(notification.context.payload.content.body, 40)
    : null;

  return (
    <NotificationListRow isSeen={notification.isSeen}>
      <CardLink
        to={{
          pathname: window.location.pathname,
          search: `?thread=${notification.context.payload.id}`,
        }}
      />
      <CardContent>
        <ThreadReactionContext>
          <Icon glyph="thumbsup-fill" />
          <ActorsRow actors={actors.asObjects} />
        </ThreadReactionContext>
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
