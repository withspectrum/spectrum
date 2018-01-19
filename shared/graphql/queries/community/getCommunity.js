// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment from '../../fragments/community/communityInfo';
import communityMetaDataFragment from '../../fragments/community/communityMetaData';

export const getCommunityByIdQuery = gql`
  query getCommunity($id: ID) {
    community(id: $id) {
      ...communityInfo
      ...communityMetaData
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
`;

const getCommunityByIdOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
};

export const getCommunityById = graphql(
  getCommunityByIdQuery,
  getCommunityByIdOptions
);

export const getCommunityBySlugQuery = gql`
  query getCommunity($slug: String) {
    community(slug: $slug) {
      ...communityInfo
      ...communityMetaData
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
`;

const getCommunityBySlugOptions = {
  options: ({ slug }) => ({
    variables: {
      slug: slug.toLowerCase(),
    },
  }),
};

export const getCommunityBySlug = graphql(
  getCommunityBySlugQuery,
  getCommunityBySlugOptions
);

export const getCommunityByMatchQuery = gql`
  query getCommunity($slug: String) {
    community(slug: $slug) {
      ...communityInfo
      ...communityMetaData
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
`;

const getCommunityByMatchOptions = {
  options: ({ match: { params: { communitySlug } } }) => ({
    variables: {
      slug: communitySlug.toLowerCase(),
    },
  }),
};

export const getCommunityByMatch = graphql(
  getCommunityByMatchQuery,
  getCommunityByMatchOptions
);
