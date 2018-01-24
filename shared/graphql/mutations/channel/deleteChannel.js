// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment from '../../fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';

export type DeleteChannelType = boolean;

export const deleteChannelMutation = gql`
  mutation deleteChannel($channelId: ID!) {
    deleteChannel(channelId: $channelId)
  }
`;

const deleteChannelOptions = {
  props: ({ channelId, mutate }) => ({
    deleteChannel: (channelId: string) =>
      mutate({
        variables: {
          channelId,
        },
      }),
  }),
};

export default graphql(deleteChannelMutation, deleteChannelOptions);
