import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { communityInfoFragment } from './fragments/community/communityInfo';
import { communityMemberConnectionFragment } from './fragments/community/communityMembers';
import { userInfoFragment } from './fragments/user/userInfo';

const COMMUNITY_INFORMATION_QUERY = gql`
  query {
    meta {
      communityGrowth {
        createdAt
      }
    }
  }
`;

export const communitiesQuery = graphql(COMMUNITY_INFORMATION_QUERY);

export const GET_COMMUNITY_BY_SLUG_QUERY = gql`
  query community($slug: String) {
    community(slug: $slug) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

export const GET_COMMUNITY_BY_SLUG_OPTIONS = {
  options: ({ slug }) => ({
    variables: {
      slug,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getCommunityBySlug = graphql(
  GET_COMMUNITY_BY_SLUG_QUERY,
  GET_COMMUNITY_BY_SLUG_OPTIONS
);

export const recentCommunitiesQuery = graphql(
  gql`
    query recentCommunities($filter: MemberConnectionFilter) {
      recentCommunities {
        ...communityInfo
        ...communityMembers
      }
    }
    ${communityInfoFragment}
    ${communityMemberConnectionFragment}
  `,
  {
    name: 'recent',
    options: () => ({
      variables: {
        filter: { isOwner: true, isMember: true },
      },
      fetchPolicy: 'cache-and-network',
    }),
  }
);
