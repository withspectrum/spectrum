// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityMetaDataFragment from '../../fragments/community/communityMetaData';
import type { CommunityMetaDataType } from '../../fragments/community/communityMetaData';

export type GetCommunitiesType = {
  ...$Exact<CommunityInfoType>,
  ...$Exact<CommunityMetaDataType>,
};

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
    fetchPolicy: 'cache-first',
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
    fetchPolicy: 'cache-first',
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
      ...communityMetaData
    }
  }
  ${communityInfoFragment}
`;

const getCommunitiesByCuratedContentTypeOptions = {
  options: ({ curatedContentType }: { curatedContentType: string }) => ({
    variables: {
      curatedContentType,
    },
    fetchPolicy: 'cache-first',
  }),
};

export const getCommunitiesByCuratedContentType = graphql(
  getCommunitiesByCuratedContentTypeQuery,
  getCommunitiesByCuratedContentTypeOptions
);
