// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import threadInfoFragment from '../../fragments/thread/threadInfo';
import channelInfoFragment from '../../fragments/channel/channelInfo';
import channelThreadConnectionFragment from '../../fragments/channel/channelThreadConnection';
import { subscribeToUpdatedThreads } from '../../subscriptions';
import { parseRealtimeThreads } from '../../subscriptions/utils';

const LoadMoreThreads = gql`
  query loadMorechannelThreads($after: String, $id: ID) {
    channel(id: $id) {
      ...channelInfo
      ...channelThreadConnection
    }
  }
  ${threadInfoFragment}
  ${channelInfoFragment}
  ${channelThreadConnectionFragment}
`;

const getchannelThreadsQuery = gql`
  query getchannel($id: ID, $after: String) {
    channel(id: $id) {
      ...channelInfo
      ...channelThreadConnection
    }
  }
  ${threadInfoFragment}
  ${channelInfoFragment}
  ${channelThreadConnectionFragment}
`;

const getchannelThreadsOptions = {
  props: ({
    ownProps,
    data: {
      fetchMore,
      error,
      loading,
      channel,
      networkStatus,
      subscribeToMore,
    },
  }) => ({
    data: {
      error,
      loading,
      networkStatus,
      channel,
      threads: channel ? channel.threadConnection.edges.map(t => t.node) : [],
      hasNextPage: channel
        ? channel.threadConnection.pageInfo.hasNextPage
        : false,
      feed: channel && channel.id,
      subscribeToUpdatedThreads: () => {
        return subscribeToMore({
          document: subscribeToUpdatedThreads,
          updateQuery: (prev, { subscriptionData }) => {
            const updatedThread = subscriptionData.data.threadUpdated;
            if (!updatedThread) return prev;

            const thischannelId = ownProps.channel.id;
            const updatedThreadShouldAppearInContext =
              thischannelId === updatedThread.channel.id;

            const newThreads = updatedThreadShouldAppearInContext
              ? parseRealtimeThreads(
                  prev.channel.threadConnection.edges,
                  updatedThread
                ).filter(thread => thread.node.channel.id === thischannelId)
              : [...prev.channel.threadConnection.edges];

            return {
              ...prev,
              channel: {
                ...prev.channel,
                threadConnection: {
                  ...prev.channel.threadConnection,
                  pageInfo: {
                    ...prev.channel.threadConnection.pageInfo,
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
              channel.threadConnection.edges[
                channel.threadConnection.edges.length - 1
              ].cursor,
            slug: channel.slug,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.channel) {
              return prev;
            }
            return {
              ...prev,
              channel: {
                ...prev.channel,
                threadConnection: {
                  ...prev.channel.threadConnection,
                  pageInfo: {
                    ...prev.channel.threadConnection.pageInfo,
                    ...fetchMoreResult.channel.threadConnection.pageInfo,
                  },
                  edges: [
                    ...prev.channel.threadConnection.edges,
                    ...fetchMoreResult.channel.threadConnection.edges,
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

export default graphql(getchannelThreadsQuery, getchannelThreadsOptions);
