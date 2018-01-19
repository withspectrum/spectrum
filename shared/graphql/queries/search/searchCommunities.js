// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import communityMetaDataFragment from '../../fragments/community/communityMetaData';

export const searchCommunitiesQuery = gql`
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

const searchCommunitiesOptions = {
  options: ({ queryString }) => ({
    variables: {
      queryString,
      type: 'COMMUNITIES',
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(searchCommunitiesQuery, searchCommunitiesOptions);
