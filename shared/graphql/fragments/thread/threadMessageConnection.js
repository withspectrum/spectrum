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

export type ThreadMessageConnectionType = {
  messageConnection: {
    pageInfo: {
      hasNextPage: boolean,
      hasPreviousPage: boolean,
    },
    edges: Array<Edge>,
  },
};

export default gql`
  fragment threadMessageConnection on Thread {
    messageConnection(
      after: $after
      first: $first
      before: $before
      last: $last
    ) @connection(key: "messageConnection") {
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
