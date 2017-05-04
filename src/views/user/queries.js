// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
// $FlowFixMe
import update from 'immutability-helper';
import { encode } from '../../helpers/utils';
import { userInfoFragment } from '../../api/fragments/user/userInfo';
import { userStoriesFragment } from '../../api/fragments/user/userStories';
import { userMetaDataFragment } from '../../api/fragments/user/userMetaData';

const LoadMoreStories = gql`
  query loadMoreUserStories($username: String, $after: String) {
    user(username: $username) {
      ...userInfo
      ...userStories
    }
  }
  ${userInfoFragment}
  ${userStoriesFragment}
`;

const storiesQueryOptions = {
  props: ({ data: { fetchMore, error, loading, user } }) => ({
    data: {
      error,
      loading,
      user,
      stories: user ? user.storyConnection.edges : '',
      fetchMore: () =>
        fetchMore({
          query: LoadMoreStories,
          variables: {
            after: user.storyConnection.edges[
              user.storyConnection.edges.length - 1
            ].cursor,
            username: user.username,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.user) {
              return prev;
            }
            return {
              ...prev,
              user: {
                ...prev.user,
                storyConnection: {
                  ...prev.user.storyConnection,
                  edges: [
                    ...prev.user.storyConnection.edges,
                    ...fetchMoreResult.user.storyConnection.edges,
                  ],
                },
              },
            };
          },
        }),
    },
  }),
  options: ({ username }) => ({
    variables: {
      username: username,
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
          If the new story was published by a user that is currently
          being viewed, or by a user that has already been fetched
          and cached by apollo, insert the new story into the array of edges
        */
        if (newStory.author.username === username) {
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
            user: {
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

export const getUserStories = graphql(
  gql`
		query getUserStories($username: String, $after: String) {
			user(username: $username) {
        ...userInfo
        ...userStories
      }
		}
    ${userInfoFragment}
    ${userStoriesFragment}
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
  options: ({ username }) => ({
    variables: {
      username: username,
    },
  }),
};

export const getUserProfile = graphql(
  gql`
		query getUserProfile($username: String) {
			user(username: $username) {
        ...userInfo
        ...userMetaData
      }
		}
    ${userInfoFragment}
    ${userMetaDataFragment}
	`,
  profileQueryOptions
);
