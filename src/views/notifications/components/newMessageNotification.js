// @flow
import * as React from 'react';
import {
  parseActors,
  parseEvent,
  parseNotificationDate,
  parseContext,
} from '../utils';
import { ActorsRow } from './actorsRow';
import { CardLink, CardContent } from 'src/components/threadFeedCard/style';
import Icon from 'src/components/icon';
import { sortAndGroupNotificationMessages } from './sortAndGroupNotificationMessages';
import {
  NotificationCard,
  TextContent,
  SuccessContext,
  Content,
} from '../style';
import getThreadLink from 'src/helpers/get-thread-link';

type Props = {
  notification: Object,
  currentUser: Object,
  history?: Object,
  markSingleNotificationSeen: Function,
};

export const NewMessageNotification = ({
  notification,
  currentUser,
  markSingleNotificationSeen,
}: Props) => {
  const actors = parseActors(notification.actors, currentUser, true);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context, currentUser);
  const unsortedMessages = notification.entities.map(notif => notif.payload);
  let messages = sortAndGroupNotificationMessages(unsortedMessages);

  if (messages.length > 3) {
    messages = messages.splice(0, messages.length - 3);
  }

  return (
    <NotificationCard
      onClick={() => markSingleNotificationSeen(notification.id)}
      isSeen={notification.isSeen}
    >
      <CardLink
        to={{
          pathname: getThreadLink(notification.context.payload),
        }}
      />
      <CardContent>
        <SuccessContext>
          <Icon glyph="message-fill" />
          <ActorsRow actors={actors.asObjects} />
        </SuccessContext>
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
