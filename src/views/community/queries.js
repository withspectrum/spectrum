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
import {
  frequencyInfoFragment,
} from '../../api/fragments/frequency/frequencyInfo';
import {
  frequencyMetaDataFragment,
} from '../../api/fragments/frequency/frequencyMetaData';

const LoadMoreStories = gql`
  query communityStories($slug: String, $after: String) {
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
      hasNextPage: community
        ? community.storyConnection.pageInfo.hasNextPage
        : false,
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
                  pageInfo: {
                    ...prev.community.storyConnection.pageInfo,
                    ...fetchMoreResult.community.storyConnection.pageInfo,
                  },
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
          If the new story was published in a community that is currently
          being viewed, or in a community that has already been fetched
          and cached by apollo, insert the new story into the array of edges
        */
        if (newStory.frequency.community.slug === slug) {
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

      /* More action reducers go here */

      /*
        If no actions trigger a change in this queries store, return the existing
        store
      */
      return prev;
    },
  }),
};

export const getCommunityStories = graphql(
  gql`
		query communityStories($slug: String, $after: String) {
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
		query communityProfile($slug: String) {
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

export const getFrequencyInfo = graphql(
  gql`
		query frequencyInfo($slug: String) {
			community(slug: $slug) {
        ...communityInfo
        frequencyConnection {
          edges {
            node {
              ...frequencyInfo
              ...frequencyMetaData
            }
          }
        }
      }
		}
    ${frequencyInfoFragment}
    ${communityInfoFragment}
    ${frequencyMetaDataFragment}
	`
);
