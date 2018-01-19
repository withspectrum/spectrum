// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment from '../../fragments/community/communityInfo';
import communityMetaDataFragment from '../../fragments/community/communityMetaData';

export const getCommunitiesByIdQuery = gql`
  query getCommunity($ids: [ID]) {
    community(ids: $ids) {
      ...communityInfo
      ...communityMetaData
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
`;

const getCommunitiesByIdOptions = {
  options: ({ ids }: { ids: Array<string> }) => ({
    variables: {
      ids,
    },
  }),
};

export const getCommunitiesById = graphql(
  getCommunitiesByIdQuery,
  getCommunitiesByIdOptions
);

export const getCommunitiesBySlugQuery = gql`
  query getCommunities($slugs: [String]) {
    community(slugs: $slugs) {
      ...communityInfo
      ...communityMetaData
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
`;

const getCommunitiesBySlugOptions = {
  options: ({ slugs }: { slugs: Array<string> }) => ({
    variables: {
      slugs: slugs.map(s => s.toLowerCase()),
    },
  }),
};

export const getCommunitiesBySlug = graphql(
  getCommunitiesBySlugQuery,
  getCommunitiesBySlugOptions
);

const getCommunitiesByCuratedContentTypeQuery = gql`
  query getCommunitiesCollection($curatedContentType: String) {
    communities(curatedContentType: $curatedContentType) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const getCommunitiesByCuratedContentTypeOptions = {
  options: ({ curatedContentType }: { curatedContentType: string }) => ({
    variables: {
      curatedContentType,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getCommunitiesByCuratedContentType = graphql(
  getCommunitiesByCuratedContentTypeQuery,
  getCommunitiesByCuratedContentTypeOptions
);
