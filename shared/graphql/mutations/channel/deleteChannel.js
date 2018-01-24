// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type DeleteChannelType = {
  data: {
    deleteChannel: boolean,
  },
};

export const deleteChannelMutation = gql`
  mutation deleteChannel($channelId: ID!) {
    deleteChannel(channelId: $channelId)
  }
`;

const deleteChannelOptions = {
  props: ({ mutate }) => ({
    deleteChannel: (channelId: string) =>
      mutate({
        variables: {
          channelId,
        },
      }),
  }),
};

export default graphql(deleteChannelMutation, deleteChannelOptions);
