// @flow
import gql from 'graphql-tag';
import directMessageThreadInfoFragment from '../directMessageThread/directMessageThreadInfo';
import type { DirectMessageThreadInfoType } from '../directMessageThread/directMessageThreadInfo';

type Edge = {
  cursor: string,
  node: {
    ...$Exact<DirectMessageThreadInfoType>,
  },
};

export type UserDirectMessageThreadsConnectionType = {
  directMessageThreadsConnection: {
    pageInfo: {
      hasNextPage: boolean,
      hasPreviousPage: boolean,
    },
    edges: Array<?Edge>,
  },
};

export default gql`
  fragment userDirectMessageThreadConnection on User {
    directMessageThreadsConnection(after: $after) {
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
