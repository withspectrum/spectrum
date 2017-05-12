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
      hasNextPage: frequency
        ? frequency.storyConnection.pageInfo.hasNextPage
        : false,
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
                  pageInfo: {
                    ...prev.frequency.storyConnection.pageInfo,
                    ...fetchMoreResult.frequency.storyConnection.pageInfo,
                  },
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
      /*
        Every apollo action triggers internal store updates via reducers.
        We can abuse this to listen for specific kinds of actions that happen
        anywhere in the app in order to update any query.

        Reference: http://dev.apollodata.com/react/cache-updates.html#resultReducers
      */
      if (
        action.type === 'APOLLO_MUTATION_RESULT' &&
        action.operationName === 'publishStory'
      ) {
        /*
          publishStory returns a story object, as well as some metadata about
          the frequency and community it was published in
        */
        const newStory = action.result.data.publishStory;

        /*
          If the new story was published in a frequency that is currently
          being viewed, or in a frequency that has already been fetched
          and cached by apollo, insert the new story into the array of edges
        */
        if (newStory.frequency.slug === slug) {
          /*
            Not sure if this is needed right now, but I'm encoding the story id
            and setting a new cursor so that we can always be sure that every
            item in the Apollo store has the same shape
          */
          const cursor = encode(newStory.id);
          const newEdge = {
            cursor,
            node: {
              ...newStory,
            },
          };

          /*
            Uses immutability helpers to set the previous state and then overlay
            only the modified data
            $unshift moves the new edge to the top of the stories array

            Reference: https://facebook.github.io/react/docs/update.html
          */
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

      /* More action reducers go here */

      /*
        If no actions trigger a change in this queries store, return the existing
        store
      */
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
  options: ({ match: { params: { frequencySlug, communitySlug } } }) => ({
    variables: {
      slug: frequencySlug,
      community: communitySlug,
    },
  }),
};

export const getFrequency = graphql(
  gql`
		query getFrequency($slug: String, $community: String) {
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
