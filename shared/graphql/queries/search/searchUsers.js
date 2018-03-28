// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';

type Node = {
  node: {
    ...$Exact<UserInfoType>,
  },
};

export type SearchUsersType = {
  searchResultsConnection: {
    edges: Array<?Node>,
  },
};

export const searchUsersQuery = gql`
  query searchUsers(
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
            }
          }
        }
      }
    }
  }
  ${userInfoFragment}
`;

const searchUsersOptions = {
  options: ({ queryString, filter = {} }) => ({
    variables: {
      queryString,
      type: 'USERS',
      filter,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(searchUsersQuery, searchUsersOptions);
