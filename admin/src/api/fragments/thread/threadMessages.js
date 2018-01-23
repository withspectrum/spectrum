// @flow
import gql from 'graphql-tag';
import { messageInfoFragment } from '../message/messageInfo';

export const threadMessagesFragment = gql`
  fragment threadMessages on Thread {
    messageConnection(first: 100, after: $after) {
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
