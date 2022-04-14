// @flow
import gql from 'graphql-tag';
import directMessageInfoFragment from '../message/directMessageInfo';
import type { DirectMessageInfoType } from '../message/directMessageInfo';

type Edge = {
  cursor: string,
  node: {
    ...$Exact<DirectMessageInfoType>,
  },
};

export type DirectMessageThreadMessageConnectionType = {
  messageConnection: {
    pageInfo: {
      hasNextPage: boolean,
      hasPreviousPage: boolean,
    },
    edges: Array<?Edge>,
  },
};

export default gql`
  fragment directMessageThreadMessageConnection on DirectMessageThread {
    messageConnection(after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          ...directMessageInfo
        }
      }
    }
  }
  ${directMessageInfoFragment}
`;
