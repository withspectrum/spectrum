// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import channelInfoFragment from '../../fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';
import channelThreadConnectionFragment from '../../fragments/channel/channelThreadConnection';
import type { ChannelThreadConnectionType } from '../../fragments/channel/channelThreadConnection';

export type GetChannelThreadConnectionType = {
  ...$Exact<ChannelInfoType>,
  ...$Exact<ChannelThreadConnectionType>,
};

export const getChannelThreadConnectionQuery = gql`
  query getChannelThreadConnection($id: ID, $after: String) {
    channel(id: $id) {
      ...channelInfo
      ...channelThreadConnection
    }
  }
  ${channelInfoFragment}
  ${channelThreadConnectionFragment}
`;

const LoadMoreThreads = gql`
  query loadMoreChannelThreads($id: ID, $after: String) {
    channel(id: $id) {
      ...channelInfo
      ...channelThreadConnection
    }
  }
  ${channelInfoFragment}
  ${channelThreadConnectionFragment}
`;

const getChannelThreadConnectionOptions = {
  props: ({
    ownProps,
    data: { fetchMore, error, loading, channel, networkStatus, refetch },
  }) => ({
    data: {
      error,
      loading,
      networkStatus,
      channel,
      refetch,
      threadConnection: channel && channel.threadConnection,
      threads:
        channel && channel.threadConnection
          ? channel.threadConnection.edges
          : [],
      feed: channel && channel.id,
      hasNextPage:
        channel && channel.threadConnection
          ? channel.threadConnection.pageInfo.hasNextPage
          : false,
      fetchMore: () =>
        fetchMore({
          query: LoadMoreThreads,
          variables: {
            after:
              channel.threadConnection.edges[
                channel.threadConnection.edges.length - 1
              ].cursor,
            id: channel.id,
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

export default graphql(
  getChannelThreadConnectionQuery,
  getChannelThreadConnectionOptions
);
