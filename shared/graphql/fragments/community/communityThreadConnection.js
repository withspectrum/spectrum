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

export type ThreadConnectionType = {
  pageInfo: {
    hasNextPage: boolean,
    hasPreviousPage: boolean,
  },
  edges: Array<?Edge>,
};

export type CommunityThreadConnectionType = {
  pinnedThread: {
    ...$Exact<ThreadInfoType>,
  },
  watercooler: {
    ...$Exact<ThreadInfoType>,
  },
  threadConnection: ThreadConnectionType,
};

export default gql`
  fragment communityThreadConnection on Community {
    pinnedThread {
      ...threadInfo
    }
    watercooler {
      ...threadInfo
    }
    threadConnection(first: 10, after: $after, sort: $sort)
      @connection(key: "community-thread-connection", filter: ["sort"]) {
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
