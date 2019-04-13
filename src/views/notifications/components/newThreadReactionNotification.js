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
  ThreadReactionContext,
  Content,
} from '../style';
import Icon from 'src/components/icon';
import { CardLink, CardContent } from 'src/components/threadFeedCard/style';
import getThreadLink from 'src/helpers/get-thread-link';

type Props = {
  notification: Object,
  currentUser: Object,
  history?: Object,
  markSingleNotificationSeen: Function,
};

export const NewThreadReactionNotification = ({
  notification,
  currentUser,
  markSingleNotificationSeen,
}: Props) => {
  const actors = parseActors(notification.actors, currentUser, true);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(
    { ...notification.context, type: 'THREAD_REACTION' },
    currentUser
  );

  return (
    <NotificationCard
      onClick={() => markSingleNotificationSeen(notification.id)}
      isSeen={notification.isSeen}
      key={notification.id}
    >
      <CardLink
        to={{
          pathname: getThreadLink(notification.context.payload),
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
