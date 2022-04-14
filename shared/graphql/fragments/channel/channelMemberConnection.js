// @flow
import gql from 'graphql-tag';
import userInfoFragment from '../user/userInfo';
import type { UserInfoType } from '../user/userInfo';

type Edge = {
  cursor: string,
  node: {
    ...$Exact<UserInfoType>,
    contextPermissions: {
      communityId: string,
      reputation: number,
    },
  },
};

export type ChannelMemberConnectionType = {
  memberConnection?: {
    pageInfo: {
      hasNextPage: boolean,
      hasPreviousPage: boolean,
    },
    edges: Array<?Edge>,
  },
};

export default gql`
  fragment channelMemberConnection on Channel {
    memberConnection(after: $after, first: $first) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          ...userInfo
          contextPermissions {
            communityId
            reputation
          }
        }
      }
    }
  }
  ${userInfoFragment}
`;
