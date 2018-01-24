// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment from '../../fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';

export type ToggleChannelSubscriptionType = {
  ...$Exact<ChannelInfoType>,
};

export const toggleChannelSubscriptionMutation = gql`
  mutation toggleChannelSubscription($channelId: ID!) {
    toggleChannelSubscription(channelId: $channelId) {
      ...channelInfo
    }
  }
  ${channelInfoFragment}
`;

const toggleChannelSubscriptionOptions = {
  options: {
    refetchQueries: ['getCurrentUserProfile', 'getEverythingThreads'],
  },
  props: ({ channelId, mutate }) => ({
    toggleChannelSubscription: ({ channelId }: { channelId: string }) =>
      mutate({
        variables: {
          channelId,
        },
      }),
  }),
};

export default graphql(
  toggleChannelSubscriptionMutation,
  toggleChannelSubscriptionOptions
);
