// @flow
import gql from 'graphql-tag';
import communityInfoFragment from '../community/communityInfo';
import type { CommunityInfoType } from '../community/communityInfo';

type Edge = {
  cursor: string,
  node: {
    ...$Exact<CommunityInfoType>,
    contextPermissions: {
      communityId: string,
      isOwner: boolean,
      isModerator: boolean,
      reputation: number,
    },
  },
};

export type UserCommunityConnectionType = {
  communityConnection: {
    pageInfo: {
      hasNextPage: boolean,
      hasPreviousPage: boolean,
    },
    edges: Array<?Edge>,
  },
};

export default gql`
  fragment userCommunityConnection on User {
    communityConnection(first: 5, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          ...communityInfo
          contextPermissions {
            communityId
            isOwner
            isModerator
            reputation
          }
        }
      }
    }
  }
  ${communityInfoFragment}
`;
