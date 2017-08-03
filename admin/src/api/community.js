import { graphql, gql } from 'react-apollo';
import { communityInfoFragment } from './fragments/community/communityInfo';

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

export const SEARCH_COMMUNITIES_QUERY = gql`
  query searchCommunities($string: String) {
    searchCommunities(string: $string) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

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

/*
  Gets top communities for the onboarding flow.
*/
export const topCommunitiesQuery = graphql(
  gql`
		{
		  topCommunities {
        ...communityInfo
      }
    }
    ${communityInfoFragment}
	`,
  {
    name: 'top',
  }
);

export const recentCommunitiesQuery = graphql(
  gql`
		{
		  recentCommunities {
        ...communityInfo
      }
    }
    ${communityInfoFragment}
	`,
  {
    name: 'recent',
  }
);
