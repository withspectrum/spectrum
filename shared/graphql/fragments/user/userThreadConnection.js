// @flow
import gql from 'graphql-tag';
import threadInfoFragment from '../thread/threadInfo';

export default gql`
  fragment userThreadConnection on User {
    threadConnection(first: 10, after: $after, kind: $kind) {
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
