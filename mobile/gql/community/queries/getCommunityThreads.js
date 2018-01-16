// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import threadInfoFragment from '../../fragments/thread/threadInfo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import communityThreadConnectionFragment from '../../fragments/community/communityThreadConnection';
import { subscribeToUpdatedThreads } from '../../subscriptions';
import { parseRealtimeThreads } from '../../subscriptions/utils';

const LoadMoreThreads = gql`
  query loadMoreCommunityThreads($after: String, $id: ID) {
    community(id: $id) {
      ...communityInfo
      pinnedThread {
        ...threadInfo
      }
      watercooler {
        ...threadInfo
      }
      ...communityThreadConnection
    }
  }
  ${threadInfoFragment}
  ${communityInfoFragment}
  ${communityThreadConnectionFragment}
`;

const getCommunityThreadsQuery = gql`
  query getCommunityThreads($id: ID, $after: String) {
    community(id: $id) {
      ...communityInfo
      pinnedThread {
        ...threadInfo
      }
      watercooler {
        ...threadInfo
      }
      ...communityThreadConnection
    }
  }
  ${threadInfoFragment}
  ${communityInfoFragment}
  ${communityThreadConnectionFragment}
`;

const getCommunityThreadsOptions = {
  props: ({
    ownProps,
    data: {
      fetchMore,
      error,
      loading,
      community,
      networkStatus,
      subscribeToMore,
    },
  }) => ({
    data: {
      error,
      loading,
      networkStatus,
      community,
      threads: community
        ? community.threadConnection.edges.map(t => t.node)
        : [],
      hasNextPage: community
        ? community.threadConnection.pageInfo.hasNextPage
        : false,
      feed: community && community.id,
      subscribeToUpdatedThreads: () => {
        return subscribeToMore({
          document: subscribeToUpdatedThreads,
          updateQuery: (prev, { subscriptionData }) => {
            const updatedThread = subscriptionData.data.threadUpdated;
            if (!updatedThread) return prev;

            const thisCommunityId = ownProps.community.id;
            const updatedThreadShouldAppearInContext =
              thisCommunityId === updatedThread.community.id;

            const newThreads = updatedThreadShouldAppearInContext
              ? parseRealtimeThreads(
                  prev.community.threadConnection.edges,
                  updatedThread
                ).filter(thread => thread.node.community.id === thisCommunityId)
              : [...prev.community.threadConnection.edges];

            return {
              ...prev,
              community: {
                ...prev.community,
                threadConnection: {
                  ...prev.community.threadConnection,
                  pageInfo: {
                    ...prev.community.threadConnection.pageInfo,
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
              community.threadConnection.edges[
                community.threadConnection.edges.length - 1
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
                threadConnection: {
                  ...prev.community.threadConnection,
                  pageInfo: {
                    ...prev.community.threadConnection.pageInfo,
                    ...fetchMoreResult.community.threadConnection.pageInfo,
                  },
                  edges: [
                    ...prev.community.threadConnection.edges,
                    ...fetchMoreResult.community.threadConnection.edges,
                  ],
                },
              },
            };
          },
        }),
    },
  }),
  options: ({ id }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(getCommunityThreadsQuery, getCommunityThreadsOptions);
