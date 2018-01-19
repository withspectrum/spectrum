// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import userInfoFragment from '../../fragments/user/userInfo';

export const searchUsersQuery = gql`
  query search($queryString: String!, $type: SearchType!) {
    search(queryString: $queryString, type: $type) {
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
  options: ({ queryString }) => ({
    variables: {
      queryString,
      type: 'USERS',
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(searchUsersQuery, searchUsersOptions);
