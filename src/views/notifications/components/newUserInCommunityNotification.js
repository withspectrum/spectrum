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
  NotificationListRow,
  Timestamp,
} from '../style';
import {
  CardLink,
  CardContent,
} from '../../../components/threadFeedCard/style';

export const NewUserInCommunityNotification = ({
  notification,
  currentUser,
}) => {
  const actors = parseActors(notification.actors, currentUser);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);

  return (
    <NotificationCard>
      <CardLink to={`/${notification.context.payload.slug}`} />
      <CardContent>
        <ActorsRow actors={actors.asObjects} />
        <TextContent pointer={true}>
          {actors.asString} {event} {context.asString}.
        </TextContent>
        <Timestamp>{date}</Timestamp>
      </CardContent>
    </NotificationCard>
  );
};

export const MiniNewUserInCommunityNotification = ({
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
      onClick={() => history.push(`/${notification.context.payload.slug}`)}
    >
      <CardLink to={`/${notification.context.payload.slug}`} />
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
