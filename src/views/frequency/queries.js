// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
// $FlowFixMe
import update from 'immutability-helper';
import { encode } from '../../helpers/utils';
import {
  frequencyInfoFragment,
} from '../../api/fragments/frequency/frequencyInfo';
import {
  frequencyStoriesFragment,
} from '../../api/fragments/frequency/frequencyStories';
import {
  frequencyMetaDataFragment,
} from '../../api/fragments/frequency/frequencyMetaData';
import {
  communityInfoFragment,
} from '../../api/fragments/community/communityInfo';

const LoadMoreStories = gql`
  query loadMoreFrequencyStories($id: ID, $after: String) {
    frequency(id: $id) {
      ...frequencyInfo
      ...frequencyStories
    }
  }
  ${frequencyInfoFragment}
  ${frequencyStoriesFragment}
`;

const storiesQueryOptions = {
  props: ({ data: { fetchMore, error, loading, frequency } }) => ({
    data: {
      error,
      loading,
      frequency,
      stories: frequency ? frequency.storyConnection.edges : '',
      fetchMore: () =>
        fetchMore({
          query: LoadMoreStories,
          variables: {
            after: frequency.storyConnection.edges[
              frequency.storyConnection.edges.length - 1
            ].cursor,
            id: frequency.id,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.frequency) {
              return prev;
            }
            return {
              ...prev,
              frequency: {
                ...prev.frequency,
                storyConnection: {
                  ...prev.frequency.storyConnection,
                  edges: [
                    ...prev.frequency.storyConnection.edges,
                    ...fetchMoreResult.frequency.storyConnection.edges,
                  ],
                },
              },
            };
          },
        }),
    },
  }),
  options: ({ slug, community }) => ({
    variables: {
      slug: slug,
      community: community,
    },
    reducer: (prev, action, variables) => {
      if (
        action.type === 'APOLLO_MUTATION_RESULT' &&
        action.operationName === 'publishStory'
      ) {
        const newStory = action.result.data.publishStory;

        if (newStory.frequency.slug === slug) {
          // if the new story was published in a frequency that is currently
          // being viewed, or in a frequency that has already been fetched
          // and cached by apollo, insert the new story into the array of edges
          const cursor = encode(newStory.id);
          const newEdge = {
            cursor,
            node: {
              ...newStory,
            },
          };
          return update(prev, {
            frequency: {
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

export const getFrequencyStories = graphql(
  gql`
    query getFrequencyStories($slug: String, $community: String, $after: String) {
			frequency(slug: $slug, community: $community) {
        ...frequencyInfo
        ...frequencyStories
      }
    }
    ${frequencyInfoFragment}
    ${frequencyStoriesFragment}
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
  options: ({ slug, community }) => ({
    variables: {
      slug: slug,
      community: community,
    },
  }),
};

export const getFrequencyProfile = graphql(
  gql`
		query getFrequencyProfile($slug: String, $community: String) {
			frequency(slug: $slug, community: $community) {
        ...frequencyInfo
        community {
          ...communityInfo
        }
        ...frequencyMetaData
      }
		}
    ${frequencyInfoFragment}
    ${communityInfoFragment}
    ${frequencyMetaDataFragment}
	`,
  profileQueryOptions
);
