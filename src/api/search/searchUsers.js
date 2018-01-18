// @flow
import { graphql, gql } from 'react-apollo';
import { userInfoFragment } from '../fragments/user/userInfo';

export const SEARCH_USERS_QUERY = gql`
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

const SEARCH_USERS_OPTIONS = {
  options: ({ queryString }) => ({
    variables: {
      queryString,
      type: 'USERS',
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(SEARCH_USERS_QUERY, SEARCH_USERS_OPTIONS);
