// @flow
// $FlowFixMe
import { gql } from 'react-apollo';

export const notificationInfoFragment = gql`
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
