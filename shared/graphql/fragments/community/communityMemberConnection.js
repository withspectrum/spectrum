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
          ...communityMemberInfo
        }
      }
    }
  }
  ${communityMemberInfoFragment}
`;
