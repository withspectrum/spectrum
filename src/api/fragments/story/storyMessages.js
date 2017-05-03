// @flow
// $FlowFixMe
import { gql } from 'react-apollo';
import { messageInfoFragment } from '../message/messageInfo';

export const storyMessagesFragment = gql`
  fragment storyMessages on Story {
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
