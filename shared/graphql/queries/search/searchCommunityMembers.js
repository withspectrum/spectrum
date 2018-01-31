// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';

type Node = {
  node: {
    ...$Exact<UserInfoType>,
    contextPermissions: {
      isMember: boolean,
      isBlocked: boolean,
      isModerator: boolean,
      reputation: number,
    },
  },
};

export type SearchCommunityMembersType = {
  searchResultsConnection: {
    edges: Array<?Node>,
  },
};

export const searchCommunityMembersQuery = gql`
  query search(
    $queryString: String!
    $type: SearchType!
    $filter: SearchFilter
  ) {
    search(queryString: $queryString, type: $type, filter: $filter) {
      searchResultsConnection {
        edges {
          node {
            ... on User {
              ...userInfo
              contextPermissions {
                isMember
                isModerator
                isOwner
                isBlocked
                reputation
              }
            }
          }
        }
      }
    }
  }
  ${userInfoFragment}
`;

const searchCommunityMembersOptions = {
  options: ({ queryString, filter = {} }) => ({
    variables: {
      queryString,
      type: 'USERS',
      filter,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(
  searchCommunityMembersQuery,
  searchCommunityMembersOptions
);
