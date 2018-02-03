// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';
import userThreadConnectionFragment from '../../fragments/user/userThreadConnection';
import type { UserThreadConnectionType } from '../../fragments/user/userThreadConnection';
import { subscribeToUpdatedThreads } from '../../subscriptions';
import { parseRealtimeThreads } from '../../subscriptions/utils';

export type GetUserThreadConnectionType = {
  ...$Exact<UserInfoType>,
  ...$Exact<UserThreadConnectionType>,
};

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

export const getUserThreadConnectionQuery = gql`
  query getUserThreadConnection(
    $id: ID
    $after: String
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

const getUserThreadConnectionOptions = {
  props: ({
    ownProps,
    data: { fetchMore, error, loading, networkStatus, user, subscribeToMore },
  }) => ({
    data: {
      error,
      loading,
      user,
      networkStatus,
      threadConnection: user && user.threadConnection,
      threads: user ? user.threadConnection.edges : '',
      hasNextPage: user ? user.threadConnection.pageInfo.hasNextPage : false,
      subscribeToUpdatedThreads: () => {
        return subscribeToMore({
          document: subscribeToUpdatedThreads,
          updateQuery: (prev, { subscriptionData }) => {
            const updatedThread = subscriptionData.data.threadUpdated;
            if (!updatedThread) return prev;

            const thisUserId = ownProps.userId;
            const updatedThreadShouldAppearInContext =
              thisUserId === updatedThread.creator.id;

            const newThreads = updatedThreadShouldAppearInContext
              ? parseRealtimeThreads(
                  prev.user.threadConnection.edges,
                  updatedThread,
                  ownProps.dispatch
                ).filter(thread => thread.node.creator.id === thisUserId)
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
            id: user.id,
            kind: ownProps.kind,
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
    fetchPolicy: 'cache-first',
  }),
};

export default graphql(
  getUserThreadConnectionQuery,
  getUserThreadConnectionOptions
);
