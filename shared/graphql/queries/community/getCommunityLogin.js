// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';

export type GetCommunityLoginType = {
  ...$Exact<CommunityInfoType>,
  brandedLogin: {
    isEnabled: boolean,
    customMessage: ?string,
  },
};

export const getCommunityLoginByIdQuery = gql`
  query getCommunityLoginById($id: ID) {
    community(id: $id) {
      ...communityInfo
      brandedLogin {
        isEnabled
        customMessage
      }
    }
  }
  ${communityInfoFragment}
`;

const getCommunityLoginByIdOptions = {
  options: ({ id }) => ({
    variables: {
      id: id,
    },
  }),
};

export const getCommunityLoginById = graphql(
  getCommunityLoginByIdQuery,
  getCommunityLoginByIdOptions
);

export const getCommunityLoginByMatchQuery = gql`
  query getCommunityLoginByMatch($slug: String) {
    community(slug: $slug) {
      ...communityInfo
      brandedLogin {
        isEnabled
        customMessage
      }
    }
  }
  ${communityInfoFragment}
`;

const getCommunityLoginByMatchOptions = {
  options: ({ match: { params: { communitySlug } } }) => ({
    variables: {
      slug: communitySlug.toLowerCase(),
    },
  }),
};

export const getCommunityLoginByMatch = graphql(
  getCommunityLoginByMatchQuery,
  getCommunityLoginByMatchOptions
);
