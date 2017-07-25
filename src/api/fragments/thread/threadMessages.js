// @flow
// $FlowFixMe
import { gql } from 'react-apollo';
import { messageInfoFragment } from '../message/messageInfo';

export const threadMessagesFragment = gql`
  fragment threadMessages on Thread {
    messageConnection(after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...messageInfo
        }
      }
    }
  }
  ${messageInfoFragment}
`;
