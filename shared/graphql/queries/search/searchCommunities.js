// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityMetaDataFragment from '../../fragments/community/communityMetaData';
import type { CommunityMetaDataType } from '../../fragments/community/communityMetaData';

type Node = {
  node: {
    ...$Exact<CommunityInfoType>,
    ...$Exact<CommunityMetaDataType>,
  },
};

export type SearchCommunitiesType = {
  searchResultsConnection: {
    edges: Array<?Node>,
  },
};

export const searchCommunitiesQuery = gql`
  query searchCommunities($queryString: String!, $type: SearchType!) {
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
