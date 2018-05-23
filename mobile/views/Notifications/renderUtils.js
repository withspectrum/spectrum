// @flow
import type { NotificationInfoType } from '../../../shared/graphql/fragments/notification/notificationInfo';
import type {
  NotificationEventType,
  NotificationPayloadType,
} from '../../../shared/types';

type Node = {
  id: string,
  payload: any,
  type: NotificationPayloadType,
};

export type ParsedNotificationType = {
  id: string,
  actors: Array<Node>,
  context: Node,
  entities: Array<Node>,
  createdAt: string,
  event: NotificationEventType,
  isRead: boolean,
  isSeen: boolean,
  modifiedAt: ?string,
};

// prettier-ignore
export const parseNotification = (notification: NotificationInfoType): ParsedNotificationType => {
  return Object.assign({}, notification, {
    actors: notification.actors.map(actor => {
      return {
        id: actor.id,
        type: actor.type,
        payload: JSON.parse(actor.payload),
      };
    }),
    context: {
      id: notification.context.id,
      type: notification.context.type,
      payload: JSON.parse(notification.context.payload),
    },
    entities: notification.entities.map(entity => {
      return {
        id: entity.id,
        type: entity.type,
        payload: JSON.parse(entity.payload),
      };
    }),
  });
};
