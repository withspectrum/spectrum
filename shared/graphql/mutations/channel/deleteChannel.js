// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment from '../../fragments/channel/channelInfo';

const deleteChannelMutation = gql`
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
