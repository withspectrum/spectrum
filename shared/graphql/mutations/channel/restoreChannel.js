// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment from 'shared/graphql/fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';

export type RestoreChannelType = {
  data: {
    restoreChannel: {
      ...$Exact<ChannelInfoType>,
    },
  },
};

export const restoreChannelMutation = gql`
  mutation restoreChannel($input: RestoreChannelInput!) {
    restoreChannel(input: $input) {
      ...channelInfo
    }
  }
  ${channelInfoFragment}
`;

const restoreChannelOptions = {
  props: ({ mutate }) => ({
    restoreChannel: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(restoreChannelMutation, restoreChannelOptions);
