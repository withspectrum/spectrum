import gql from 'graphql-tag';
import { threadInfoFragment } from '../thread/threadInfo';

export const channelThreadsFragment = gql`
  fragment channelThreads on Channel {
    threadConnection(first: 10, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          ...threadInfo
        }
      }
    }
  }
  ${threadInfoFragment}
`;
