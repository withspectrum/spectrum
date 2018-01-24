// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment from 'shared/graphql/fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';

export type ToggleChannelNotificationsType = {
  data: {
    toggleChannelNotifications: {
      ...$Exact<ChannelInfoType>,
    },
  },
};

export const toggleChannelNotificationsMutation = gql`
  mutation toggleChannelNotifications($channelId: ID!) {
    toggleChannelNotifications(channelId: $channelId) {
      ...channelInfo
    }
  }
  ${channelInfoFragment}
`;

const toggleChannelNotificationsOptions = {
  props: ({ mutate }) => ({
    toggleChannelNotifications: (channelId: string) =>
      mutate({
        variables: {
          channelId,
        },
      }),
  }),
};

export default graphql(
  toggleChannelNotificationsMutation,
  toggleChannelNotificationsOptions
);
