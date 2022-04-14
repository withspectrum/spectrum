// @flow
import gql from 'graphql-tag';
import communityMemberInfoFragment, {
  type CommunityMemberInfoType,
} from '../communityMember/communityMemberInfo';

type Edge = {
  cursor: string,
  node: {
    ...$Exact<CommunityMemberInfoType>,
  },
};

export type CommunityMembersType = {
  members: {
    pageInfo: {
      hasNextPage: boolean,
      hasPreviousPage: boolean,
    },
    edges: Array<?Edge>,
  },
};

export default gql`
  fragment communityMembers on Community {
    members(after: $after, filter: $filter, first: $first)
      @connection(key: "communityMembers", filters: ["filter"]) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          ...communityMemberInfo
        }
      }
    }
  }
  ${communityMemberInfoFragment}
`;
