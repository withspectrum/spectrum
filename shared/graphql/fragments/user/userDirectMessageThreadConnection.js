// @flow
import gql from 'graphql-tag';
import directMessageThreadInfoFragment from '../directMessageThread/directMessageThreadInfo';

export default gql`
  fragment userDirectMessageThreadConnection on User {
    directMessageThreadsConnection {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          ...directMessageThreadInfo
        }
      }
    }
  }
  ${directMessageThreadInfoFragment}
`;
