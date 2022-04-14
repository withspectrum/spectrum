// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import userEverythingConnectionFragment, {
  type UserEverythingConnectionType,
} from '../../fragments/user/userEverythingConnection';
import { subscribeToUpdatedThreads } from '../../subscriptions';
import { parseRealtimeThreads } from '../../subscriptions/utils';

export type GetCurrentUserEverythingFeedType = {
  id: string,
  ...$Exact<UserEverythingConnectionType>,
};

const LoadMoreThreads = gql`
  query loadMoreEverythingThreads($after: String) {
    user: currentUser {
      id
      ...userEverythingConnection
    }
  }
  ${userEverythingConnectionFragment}
`;

export const getCurrentUserEverythingQuery = gql`
  query getEverythingThreads($after: String) {
    user: currentUser {
      id
      ...userEverythingConnection
    }
  }
  ${userEverythingConnectionFragment}
`;

const getCurrentUserEverythingOptions = {
  options: () => ({
    fetchPolicy: 'cache-and-network',
  }),
  props: ({
    ownProps,
    data: {
      fetchMore,
      error,
      loading,
      user,
      networkStatus,
      subscribeToMore,
      refetch,
    },
  }) => ({
    data: {
      error,
      loading,
      user,
      networkStatus,
      refetch,
      threads: user && user.everything ? user.everything.edges : '',
      feed: 'everything',
      threadConnection: user && user.everything ? user.everything : null,
      hasNextPage:
        user && user.everything ? user.everything.pageInfo.hasNextPage : false,
      subscribeToUpdatedThreads: () => {
        return subscribeToMore({
          document: subscribeToUpdatedThreads,
          updateQuery: (prev, { subscriptionData }) => {
            const updatedThread = subscriptionData.data.threadUpdated;
            if (!updatedThread) return prev;

            const newThreads = parseRealtimeThreads(
              prev.user.everything.edges,
              updatedThread
            );

            // Add the new notification to the data
            return Object.assign({}, prev, {
              ...prev,
              user: {
                ...prev.user,
                everything: {
                  ...prev.user.everything,
                  edges: newThreads,
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
};

export default graphql(
  getCurrentUserEverythingQuery,
  getCurrentUserEverythingOptions
);
