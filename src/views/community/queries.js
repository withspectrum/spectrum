// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
// $FlowFixMe
import update from 'immutability-helper';
import { encode } from '../../helpers/utils';
import {
  communityInfoFragment,
} from '../../api/fragments/community/communityInfo';
import {
  communityStoriesFragment,
} from '../../api/fragments/community/communityStories';
import {
  communityMetaDataFragment,
} from '../../api/fragments/community/communityMetaData';

const LoadMoreStories = gql`
  query loadMoreCommunityStories($slug: String, $after: String) {
    community(slug: $slug) {
      ...communityInfo
      ...communityStories
    }
  }
  ${communityInfoFragment}
  ${communityStoriesFragment}
`;

const storiesQueryOptions = {
  props: ({ data: { fetchMore, error, loading, community } }) => ({
    data: {
      error,
      loading,
      community,
      stories: community ? community.storyConnection.edges : '',
      fetchMore: () =>
        fetchMore({
          query: LoadMoreStories,
          variables: {
            after: community.storyConnection.edges[
              community.storyConnection.edges.length - 1
            ].cursor,
            slug: community.slug,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.community) {
              return prev;
            }
            return {
              ...prev,
              community: {
                ...prev.community,
                storyConnection: {
                  ...prev.community.storyConnection,
                  edges: [
                    ...prev.community.storyConnection.edges,
                    ...fetchMoreResult.community.storyConnection.edges,
                  ],
                },
              },
            };
          },
        }),
    },
  }),
  options: ({ slug, params }) => ({
    variables: {
      slug: slug,
    },
    reducer: (prev, action, variables) => {
      if (
        action.type === 'APOLLO_MUTATION_RESULT' &&
        action.operationName === 'publishStory'
      ) {
        const newStory = action.result.data.publishStory;

        if (newStory.frequency.community.slug === slug) {
          // if the new story was published in a community that is currently
          // being viewed, or in a community that has already been fetched
          // and cached by apollo, insert the new story into the array of edges
          const cursor = encode(newStory.id);
          const newEdge = {
            cursor,
            node: {
              ...newStory,
            },
          };
          return update(prev, {
            community: {
              storyConnection: {
                edges: {
                  $unshift: [newEdge],
                },
              },
            },
          });
        }
      }
      return prev;
    },
  }),
};

export const getCommunityStories = graphql(
  gql`
		query getCommunityStories($slug: String, $after: String) {
			community(slug: $slug) {
        ...communityInfo
        ...communityStories
      }
		}
    ${communityStoriesFragment}
    ${communityInfoFragment}
	`,
  storiesQueryOptions
);

/*
  Loads the sidebar profile component widget independent of the story feed.
  In the future we can compose these queries together since they are fetching
  such similar data, but for now we're making a decision to keep the data
  queries specific to each component.
*/
const profileQueryOptions = {
  options: ({ slug }) => ({
    variables: {
      slug: slug,
    },
  }),
};

export const getCommunityProfile = graphql(
  gql`
		query getCommunityProfile($slug: String) {
			community(slug: $slug) {
        ...communityInfo
        ...communityMetaData
      }
		}
    ${communityInfoFragment}
    ${communityMetaDataFragment}
	`,
  profileQueryOptions
);
