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
  ReactionContext,
  Content,
} from '../style';
import Icon from '../../../components/icons';
import {
  CardLink,
  CardContent,
} from '../../../components/threadFeedCard/style';

type Props = {
  notification: Object,
  currentUser: Object,
  history?: Object,
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
            {actors.asString} {event} {context.asString} {date}{' '}
          </TextContent>
        </Content>
      </CardContent>
    </NotificationListRow>
  );
};
