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
  ReactionContext,
  Content,
} from '../style';
import Icon from 'src/components/icon';
import { CardLink, CardContent } from 'src/components/threadFeedCard/style';

type Props = {
  notification: Object,
  currentUser: Object,
  history?: Object,
  markSingleNotificationSeen: Function,
};

export const NewReactionNotification = ({
  notification,
  currentUser,
  markSingleNotificationSeen,
}: Props) => {
  const actors = parseActors(notification.actors, currentUser, true);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);

  return (
    <NotificationCard
      onClick={() => markSingleNotificationSeen(notification.id)}
      isSeen={notification.isSeen}
      key={notification.id}
    >
      <CardLink
        to={{
          // TODO(@mxstbr): Make this open in the modal
          pathname: `/thread/${notification.context.payload.threadId}`,
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
