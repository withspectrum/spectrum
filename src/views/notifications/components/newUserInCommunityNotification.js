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
  JoinContext,
  Content,
} from '../style';
import Icon from '../../../components/icons';
import {
  CardLink,
  CardContent,
} from '../../../components/threadFeedCard/style';

export const NewUserInCommunityNotification = ({
  notification,
  currentUser,
}) => {
  const actors = parseActors(notification.actors, currentUser, true);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);

  return (
    <NotificationCard>
      <CardLink to={`/${notification.context.payload.slug}`} />
      <CardContent>
        <JoinContext>
          <Icon glyph="member-add" />
          <ActorsRow actors={actors.asObjects} />
        </JoinContext>
      </CardContent>
      <Content>
        <TextContent pointer={true}>
          {' '}
          {actors.asString} {event} {context.asString} {date}{' '}
        </TextContent>
      </Content>
    </NotificationCard>
  );
};

export const MiniNewUserInCommunityNotification = ({
  notification,
  currentUser,
  history,
}) => {
  const actors = parseActors(notification.actors, currentUser, true);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);

  return (
    <NotificationListRow>
      <CardLink to={`/${notification.context.payload.slug}`} />
      <CardContent>
        <JoinContext>
          <Icon glyph="member-add" />
          <ActorsRow actors={actors.asObjects} />
        </JoinContext>
      </CardContent>
      <Content>
        <TextContent pointer={false}>
          {' '}
          {actors.asString} {event} {context.asString} {date}{' '}
        </TextContent>
      </Content>
    </NotificationListRow>
  );
};
