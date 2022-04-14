// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityMemberInfoFragment, {
  type CommunityMemberInfoType,
} from '../../fragments/communityMember/communityMemberInfo';

type Node = {
  node: {
    ...$Exact<CommunityMemberInfoType>,
  },
};

export type SearchCommunityMembersType = {
  searchResultsConnection: {
    edges: Array<?Node>,
  },
};

export const searchCommunityMembersQuery = gql`
  query searchCommunityMembers(
    $queryString: String!
    $type: SearchType!
    $filter: SearchFilter
  ) {
    search(queryString: $queryString, type: $type, filter: $filter) {
      searchResultsConnection {
        edges {
          node {
            ... on CommunityMember {
              ...communityMemberInfo
            }
          }
        }
      }
    }
  }
  ${communityMemberInfoFragment}
`;

const searchCommunityMembersOptions = {
  options: ({ queryString, filter = {} }) => ({
    variables: {
      queryString,
      type: 'COMMUNITY_MEMBERS',
      filter,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(
  searchCommunityMembersQuery,
  searchCommunityMembersOptions
);
