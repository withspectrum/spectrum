// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityMetaDataFragment from '../../fragments/community/communityMetaData';
import type { CommunityMetaDataType } from '../../fragments/community/communityMetaData';

type Node = {
  ...$Exact<CommunityInfoType>,
  ...$Exact<CommunityMetaDataType>,
};

export type GetCommunitiesType = Array<?Node>;

export const getCommunitiesByIdsQuery = gql`
  query getCommunitiesByIds($ids: [ID]) {
    communities(ids: $ids) {
      ...communityInfo
      ...communityMetaData
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
`;

const getCommunitiesByIdsOptions = {
  options: ({ ids }: { ids: Array<string> }) => ({
    variables: {
      ids,
    },
    fetchPolicy: 'cache-first',
  }),
};

export const getCommunitiesByIds = graphql(
  getCommunitiesByIdsQuery,
  getCommunitiesByIdsOptions
);

export const getCommunitiesBySlugsQuery = gql`
  query getCommunitiesBySlugs($slugs: [LowercaseString]) {
    communities(slugs: $slugs) {
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
      slugs: slugs,
    },
    fetchPolicy: 'cache-first',
  }),
};

export const getCommunitiesBySlug = graphql(
  getCommunitiesBySlugsQuery,
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
  ${communityMetaDataFragment}
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
