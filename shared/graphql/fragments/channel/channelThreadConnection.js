// @flow
import gql from 'graphql-tag';
import threadInfoFragment from '../thread/threadInfo';
import type { ThreadInfoType } from '../thread/threadInfo';

type Edge = {
  cursor: string,
  node: {
    ...$Exact<ThreadInfoType>,
  },
};

export type ChannelThreadConnectionType = {
  threadConnection: {
    pageInfo: {
      hasNextPage: boolean,
      hasPreviousPage: boolean,
    },
    edges: Array<?Edge>,
  },
};

export default gql`
  fragment channelThreadConnection on Channel {
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
