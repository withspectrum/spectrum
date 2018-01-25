// @flow
import gql from 'graphql-tag';

type Node = {
  id: string,
  type: string,
  payload: string,
};

export type NotificationInfoType = {
  id: string,
  createdAt: Date,
  modifiedAt: ?Date,
  actors: Array<Node>,
  context: Node,
  entities: Array<Node>,
  event: string,
  isRead: boolean,
  isSeen: boolean,
};

export default gql`
  fragment notificationInfo on Notification {
    id
    createdAt
    modifiedAt
    actors {
      id
      type
      payload
    }
    context {
      id
      type
      payload
    }
    entities {
      id
      type
      payload
    }
    event
    isRead
    isSeen
  }
`;
