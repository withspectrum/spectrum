// @flow
// $FlowFixMe
import { gql } from 'react-apollo';
import { messageInfoFragment } from '../message/messageInfo';

export const threadMessagesFragment = gql`
  fragment threadMessages on Thread {
    messageConnection(
      after: $after
      first: $first
      before: $before
      last: $last
    ) @connection(key: "messageConnection") {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          ...messageInfo
        }
      }
    }
  }
  ${messageInfoFragment}
`;
