// @flow
import gql from 'graphql-tag';
import communityInfoFragment from '../community/communityInfo';
import communityMetaDataFragment from '../community/communityMetaData';
import type { CommunityInfoType } from '../community/communityInfo';
import type { CommunityMetaDataType } from '../community/communityMetaData';

type Edge = {
  node: {
    ...$Exact<CommunityInfoType>,
    ...$Exact<CommunityMetaDataType>,
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
    edges: Array<Edge>,
  },
};

export default gql`
  fragment userCommunityConnection on User {
    communityConnection {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...communityInfo
          ...communityMetaData
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
  ${communityMetaDataFragment}
  ${communityInfoFragment}
`;
