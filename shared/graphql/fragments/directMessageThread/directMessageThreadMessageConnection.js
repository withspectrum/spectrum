// @flow
import gql from 'graphql-tag';
import messageInfoFragment from '../message/messageInfo';
import type { MessageInfoType } from '../message/messageInfo';

type Edge = {
  cursor: string,
  node: {
    ...$Exact<MessageInfoType>,
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
          ...messageInfo
        }
      }
    }
  }
  ${messageInfoFragment}
`;
