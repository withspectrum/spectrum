// @flow
import gql from 'graphql-tag';
import threadInfoFragment, { type ThreadInfoType } from '../thread/threadInfo';
import watercoolerInfoFragment, {
  type WatercoolerInfoType,
} from '../thread/watercoolerInfo';

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
    ...$Exact<WatercoolerInfoType>,
  },
  threadConnection: ThreadConnectionType,
};

export default gql`
  fragment communityThreadConnection on Community {
    pinnedThread {
      ...threadInfo
    }
    watercooler {
      ...watercoolerInfo
    }
    threadConnection(first: 10, after: $after, sort: $sort) {
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
  ${watercoolerInfoFragment}
`;
