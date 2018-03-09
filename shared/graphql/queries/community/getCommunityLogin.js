// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';

export type GetCommunityLoginType = {
  ...$Exact<CommunityInfoType>,
  brandedLogin: ?{
    customMessage: ?string,
  },
};

export const getCommunityLoginByMatchQuery = gql`
  query getCommunity($slug: String) {
    community(slug: $slug) {
      ...communityInfo
      brandedLogin {
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
