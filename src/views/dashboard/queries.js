// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
// $FlowFixMe
import update from 'immutability-helper';
import { encode } from '../../helpers/utils';
import { userInfoFragment } from '../../api/fragments/user/userInfo';
import { userEverythingFragment } from '../../api/fragments/user/userEverything';
import { userCommunitiesFragment } from '../../api/fragments/user/userCommunities';
import { subscribeToUpdatedThreads } from '../../api/subscriptions';

const LoadMoreThreads = gql`
  query loadMoreEverythingThreads($after: String) {
    user: currentUser {
      id
      ...userEverything
    }
  }
  ${userEverythingFragment}
`;

const threadsQueryOptions = {
  props: ({
    data: { fetchMore, error, loading, user, networkStatus, subscribeToMore },
  }) => ({
    data: {
      error,
      loading,
      user,
      networkStatus,
      threads: user ? user.everything.edges : '',
      hasNextPage: user ? user.everything.pageInfo.hasNextPage : false,
      subscribeToUpdatedThreads: () => {
        return subscribeToMore({
          document: subscribeToUpdatedThreads,
          updateQuery: (prev, { subscriptionData }) => {
            const updatedThread = subscriptionData.data.threadUpdated;
            if (!updatedThread) return prev;

            // determine if the incoming thread already exists in the cache. If not, it's new - so we'll send a prop down to the client to render a 'new activity' bubble which will trigger a re-render
            // const prevThreadIds = prev.user.everything.edges.map(thread => thread.node.id)
            // const isNewThread = prevThreadIds.indexOf(updatedThread.id) < 0

            // Add the new notification to the data
            return Object.assign({}, prev, {
              ...prev,
              user: {
                ...prev.user,
                everything: {
                  ...prev.user.everything,
                  edges: [
                    ...prev.user.everything.edges.map(thread => {
                      if (thread.node.id !== updatedThread.id) return thread;
                      return {
                        node: updatedThread,
                        cursor: '__this-is-a-cursor__',
                        __typename: 'Thread',
                      };
                    }),
                  ],
                },
              },
            });
          },
        });
      },
      fetchMore: () =>
        fetchMore({
          query: LoadMoreThreads,
          variables: {
            after:
              user.everything.edges[user.everything.edges.length - 1].cursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.user) {
              return prev;
            }
            return {
              ...prev,
              user: {
                ...prev.user,
                everything: {
                  ...prev.user.everything,
                  pageInfo: {
                    ...prev.user.everything.pageInfo,
                    ...fetchMoreResult.user.everything.pageInfo,
                  },
                  edges: [
                    ...prev.user.everything.edges,
                    ...fetchMoreResult.user.everything.edges,
                  ],
                },
              },
            };
          },
        }),
    },
  }),
  options: ({ params }) => ({
    reducer: (prev, action, variables) => {
      if (
        action.type === 'APOLLO_MUTATION_RESULT' &&
        action.operationName === 'publishThread'
      ) {
        const newThread = action.result.data.publishThread;
        const cursor = encode(newThread.id);
        const newEdge = {
          cursor,
          node: {
            ...newThread,
          },
        };
        return update(prev, {
          user: {
            everything: {
              edges: {
                $unshift: [newEdge],
              },
            },
          },
        });
      }
      return prev;
    },
  }),
};

export const getEverythingThreads = graphql(
  gql`
  query getEverythingThreads($after: String) {
    user: currentUser {
      id
      ...userEverything
    }
  }
  ${userEverythingFragment}
`,
  threadsQueryOptions
);

/*
  Loads the sidebar profile component widget independent of the thread feed.
  In the future we can compose these queries together since they are fetching
  such similar data, but for now we're making a decision to keep the data
  queries specific to each component.
*/
export const getCurrentUserProfile = graphql(
  gql`
    query getCurrentUserProfile {
			user: currentUser {
        ...userInfo
        ...userCommunities
      }
		}
    ${userInfoFragment}
    ${userCommunitiesFragment}
	`,
  { options: { fetchPolicy: 'cache-and-network' } }
);
