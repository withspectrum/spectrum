// @flow
import { graphql, gql } from 'react-apollo';
import { communityInfoFragment } from '../fragments/community/communityInfo';
import { communityMetaDataFragment } from '../fragments/community/communityMetaData';

export const SEARCH_COMMUNITIES_QUERY = gql`
  query search($queryString: String!, $type: SearchType!) {
    search(queryString: $queryString, type: $type) {
      searchResultsConnection {
        edges {
          node {
            ... on Community {
              ...communityInfo
              ...communityMetaData
            }
          }
        }
      }
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
`;

const SEARCH_COMMUNITIES_OPTIONS = {
  options: ({ queryString }) => ({
    variables: {
      queryString,
      type: 'COMMUNITIES',
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(SEARCH_COMMUNITIES_QUERY, SEARCH_COMMUNITIES_OPTIONS);
