// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
// $FlowFixMe
import update from 'immutability-helper';
import { encode } from '../../helpers/utils';
import { userInfoFragment } from '../../api/fragments/user/userInfo';
import { userThreadsFragment } from '../../api/fragments/user/userThreads';
import { userMetaDataFragment } from '../../api/fragments/user/userMetaData';
import { userCommunitiesFragment } from '../../api/fragments/user/userCommunities';
import { subscribeToUpdatedThreads } from '../../api/subscriptions';
import parseRealtimeThreads from '../../helpers/realtimeThreads';

const LoadMoreThreads = gql`
  query loadMoreUserThreads($username: String, $after: String) {
    user(username: $username) {
      ...userInfo
      ...userThreads
    }
  }
  ${userInfoFragment}
  ${userThreadsFragment}
`;

const threadsQueryOptions = {
  props: ({
    ownProps,
    data: { fetchMore, error, loading, networkStatus, user, subscribeToMore },
  }) => ({
    data: {
      error,
      loading,
      user,
      networkStatus,
      threads: user ? user.threadConnection.edges : '',
      hasNextPage: user ? user.threadConnection.pageInfo.hasNextPage : false,
      subscribeToUpdatedThreads: () => {
        return subscribeToMore({
          document: subscribeToUpdatedThreads,
          updateQuery: (prev, { subscriptionData }) => {
            const updatedThread = subscriptionData.data.threadUpdated;
            if (!updatedThread) return prev;

            const newThreads = parseRealtimeThreads(
              prev.user.threadConnection.edges,
              updatedThread,
              ownProps.dispatch
            );

            return {
              ...prev,
              user: {
                ...prev.user,
                threadConnection: {
                  ...prev.user.threadConnection,
                  pageInfo: {
                    ...prev.user.threadConnection.pageInfo,
                  },
                  edges: newThreads,
                },
              },
            };
          },
        });
      },
      fetchMore: () =>
        fetchMore({
          query: LoadMoreThreads,
          variables: {
            after:
              user.threadConnection.edges[
                user.threadConnection.edges.length - 1
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
                threadConnection: {
                  ...prev.user.threadConnection,
                  pageInfo: {
                    ...prev.user.threadConnection.pageInfo,
                    ...fetchMoreResult.user.threadConnection.pageInfo,
                  },
                  edges: [
                    ...prev.user.threadConnection.edges,
                    ...fetchMoreResult.user.threadConnection.edges,
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
    fetchPolicy: 'cache-first',
    reducer: (prev, action, variables) => {
      /*
        Every apollo action triggers internal store updates via reducers.
        We can abuse this to listen for specific kinds of actions that happen
        anywhere in the app in order to update any query.

        Reference: http://dev.apollodata.com/react/cache-updates.html#resultReducers
      */
      if (
        action.type === 'APOLLO_MUTATION_RESULT' &&
        action.operationName === 'publishThread'
      ) {
        /*
          publishThread returns a thread object, as well as some metadata about
          the channel and community it was published in
        */
        const newThread = action.result.data.publishThread;

        /*
          If the new thread was published by a user that is currently
          being viewed, or by a user that has already been fetched
          and cached by apollo, insert the new thread into the array of edges
        */
        if (newThread.creator.username === username) {
          /*
            Not sure if this is needed right now, but I'm encoding the thread id
            and setting a new cursor so that we can always be sure that every
            item in the Apollo store has the same shape
          */
          const cursor = encode(newThread.id);
          const newEdge = {
            cursor,
            node: {
              ...newThread,
            },
          };

          /*
            Uses immutability helpers to set the previous state and then overlay
            only the modified data
            $unshift moves the new edge to the top of the threads array

            Reference: https://facebook.github.io/react/docs/update.html
          */
          return update(prev, {
            user: {
              threadConnection: {
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

export const getUserThreads = graphql(
  gql`
		query getUserThreads($username: String, $after: String) {
			user(username: $username) {
        ...userInfo
        ...userThreads
      }
		}
    ${userInfoFragment}
    ${userThreadsFragment}
	`,
  threadsQueryOptions
);

/*
  Loads the sidebar profile component widget independent of the thread feed.
  In the future we can compose these queries together since they are fetching
  such similar data, but for now we're making a decision to keep the data
  queries specific to each component.
*/
const profileQueryOptions = {
  options: ({ match: { params: { username } } }) => ({
    variables: {
      username: username,
    },
    fetchPolicy: 'cache-first',
  }),
};

export const getUser = graphql(
  gql`
		query getUser($username: String) {
			user(username: $username) {
        ...userInfo
        ...userMetaData
        ...userCommunities
      }
		}
    ${userInfoFragment}
    ${userMetaDataFragment}
    ${userCommunitiesFragment}
	`,
  profileQueryOptions
);
