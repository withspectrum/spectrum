//@flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { communityInfoFragment } from '../../api/fragments/community/communityInfo';

export const getCommunity = graphql(
  gql`
		query getCommunity($slug: String) {
			community(slug: $slug) {
        ...communityInfo
      }
		}
    ${communityInfoFragment}
	`,
  {
    options: ({ slug }) => ({
      variables: {
        slug,
      },
      fetchPolicy: 'cache-and-network',
    }),
  }
);

/*
  Gets top communities for the onboarding flow.
*/
export const getTopCommunities = graphql(
  gql`
		{
		  topCommunities {
        ...communityInfo
      }
    }
    ${communityInfoFragment}
	`,
  {
    props: ({ data: { error, loading, topCommunities } }) => ({
      data: {
        error,
        loading,
        topCommunities,
      },
    }),
  }
);

const GET_COMMUNITIES_OPTIONS = {
  options: ({ curatedContentType }) => ({
    variables: {
      curatedContentType,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

const GET_COMMUNITIES_QUERY = gql`
  query getCommunitiesCollection($curatedContentType: String) {
    communities(curatedContentType: $curatedContentType) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

export const getCommunitiesCollectionQuery = graphql(
  GET_COMMUNITIES_QUERY,
  GET_COMMUNITIES_OPTIONS
);
