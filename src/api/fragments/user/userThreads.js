import { gql } from 'react-apollo';
import { threadInfoFragment } from '../thread/threadInfo';

export const userThreadsFragment = gql`
  fragment userThreads on User {
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
