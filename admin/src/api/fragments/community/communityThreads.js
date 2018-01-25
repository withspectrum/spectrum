import gql from 'graphql-tag';
import { threadInfoFragment } from '../thread/threadInfo';

export const communityThreadsFragment = gql`
  fragment communityThreads on Community {
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
