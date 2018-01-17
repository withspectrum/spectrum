// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from '../../../../shared/graphql/fragments/user/userInfo';
import userThreadConnectionFragment from '../../../../shared/graphql/fragments/user/userThreadConnection';
import { subscribeToUpdatedThreads } from '../../../../shared/graphql/subscriptions';
import { parseRealtimeThreads } from '../../../../shared/graphql/subscriptions/utils';

const LoadMoreThreads = gql`
  query loadMoreUserThreads(
    $after: String
    $id: ID
    $kind: ThreadConnectionType
  ) {
    user(id: $id) {
      ...userInfo
      ...userThreadConnection
    }
  }
  ${userInfoFragment}
  ${userThreadConnectionFragment}
`;

const getUserThreadsQuery = gql`
  query getUserThreads($id: ID, $after: String, $kind: ThreadConnectionType) {
    user(id: $id) {
      ...userInfo
      ...userThreadConnection
    }
  }
  ${userInfoFragment}
  ${userThreadConnectionFragment}
`;

const getUserThreadsOptions = {
  props: ({
    ownProps,
    data: { fetchMore, error, loading, user, networkStatus, subscribeToMore },
  }) => ({
    data: {
      error,
      loading,
      networkStatus,
      user,
      threads: user ? user.threadConnection.edges.map(t => t.node) : [],
      hasNextPage: user ? user.threadConnection.pageInfo.hasNextPage : false,
      feed: user && user.id,
      subscribeToUpdatedThreads: () => {
        return subscribeToMore({
          document: subscribeToUpdatedThreads,
          updateQuery: (prev, { subscriptionData }) => {
            const updatedThread = subscriptionData.data.threadUpdated;
            if (!updatedThread) return prev;

            const thisuserId = ownProps.user.id;
            const updatedThreadShouldAppearInContext =
              thisuserId === updatedThread.user.id;

            const newThreads = updatedThreadShouldAppearInContext
              ? parseRealtimeThreads(
                  prev.user.threadConnection.edges,
                  updatedThread
                ).filter(thread => thread.node.user.id === thisuserId)
              : [...prev.user.threadConnection.edges];

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
            slug: user.slug,
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
  options: ({ id, kind }) => ({
    variables: {
      id,
      kind,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(getUserThreadsQuery, getUserThreadsOptions);
