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
      isOwner: boolean,
      isModerator: boolean,
      isBlocked: boolean,
      isMember: boolean,
    },
  },
};

export type CommunityMemberConnectionType = {
  memberConnection: {
    pageInfo: {
      hasNextPage: boolean,
      hasPreviousPage: boolean,
    },
    edges: Array<?Edge>,
  },
};

export default gql`
  fragment communityMemberConnection on Community {
    memberConnection(after: $after, filter: $filter)
      @connection(key: "communityMemberConnection") {
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
            isOwner
            isModerator
            isBlocked
            isMember
          }
        }
      }
    }
  }
  ${userInfoFragment}
`;
