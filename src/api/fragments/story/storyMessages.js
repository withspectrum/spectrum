// @flow
// $FlowFixMe
import { gql } from 'react-apollo';
import { messageInfoFragment } from '../message/messageInfo';

export const storyMessagesFragment = gql`
  fragment storyMessages on Story {
    messageConnection(first: 100) {
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
