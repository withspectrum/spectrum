import gql from 'graphql-tag';
import { threadInfoFragment } from '../thread/threadInfo';

export const userEverythingFragment = gql`
  fragment userEverything on User {
    everything(first: 10, after: $after) {
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
