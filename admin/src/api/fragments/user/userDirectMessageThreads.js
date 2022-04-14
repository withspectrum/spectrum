// @flow
import gql from 'graphql-tag';
import { directMessageThreadInfoFragment } from '../directMessageThread/directMessageThreadInfo';

export const userDirectMessageThreadsFragment = gql`
  fragment userDirectMessageThreads on User {
    directMessageThreadsConnection {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...directMessageThreadInfo
        }
      }
    }
  }
  ${directMessageThreadInfoFragment}
`;
