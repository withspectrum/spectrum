// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import channelInfoFragment from '../../fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';
import channelMemberConnectionFragment from '../../fragments/channel/channelMemberConnection';
import type { ChannelMemberConnectionType } from '../../fragments/channel/channelMemberConnection';

export type GetChannelMemberConnectionType = {
  ...$Exact<ChannelInfoType>,
  ...$Exact<ChannelMemberConnectionType>,
};

export const getChannelMemberConnectionQuery = gql`
  query getChannelMemberConnection($id: ID, $first: Int, $after: String) {
    channel(id: $id) {
      ...channelInfo
      ...channelMemberConnection
    }
  }
  ${channelInfoFragment}
  ${channelMemberConnectionFragment}
`;

const LoadMoreMembers = gql`
  query loadMoreChannelMembers($id: ID, $first: Int, $after: String) {
    channel(id: $id) {
      ...channelInfo
      ...channelMemberConnection
    }
  }
  ${channelInfoFragment}
  ${channelMemberConnectionFragment}
`;

const getChannelMemberConnectionOptions = {
  props: ({ data: { fetchMore, error, loading, channel, networkStatus } }) => ({
    data: {
      error,
      loading,
      channel,
      networkStatus: networkStatus,
      hasNextPage:
        channel && channel.memberConnection
          ? channel.memberConnection.pageInfo.hasNextPage
          : false,
      fetchMore: () =>
        fetchMore({
          query: LoadMoreMembers,
          variables: {
            id: channel.id,
            after:
              channel.memberConnection.edges[
                channel.memberConnection.edges.length - 1
              ].cursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.channel) {
              return prev;
            }

            return {
              ...prev,
              channel: {
                ...prev.channel,
                memberConnection: {
                  ...prev.channel.memberConnection,
                  pageInfo: {
                    ...prev.channel.memberConnection.pageInfo,
                    ...fetchMoreResult.channel.memberConnection.pageInfo,
                  },
                  edges: [
                    ...prev.channel.memberConnection.edges,
                    ...fetchMoreResult.channel.memberConnection.edges,
                  ],
                },
              },
            };
          },
        }),
    },
  }),
  options: ({ id, first = 10 }) => ({
    variables: {
      id,
      first,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(
  getChannelMemberConnectionQuery,
  getChannelMemberConnectionOptions
);
