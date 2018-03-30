// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment from 'shared/graphql/fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';

export type ArchiveChannelType = {
  data: {
    archiveChannel: {
      ...$Exact<ChannelInfoType>,
    },
  },
};

export const archiveChannelMutation = gql`
  mutation archiveChannel($input: ArchiveChannelInput!) {
    archiveChannel(input: $input) {
      ...channelInfo
    }
  }
  ${channelInfoFragment}
`;

const archiveChannelOptions = {
  props: ({ mutate }) => ({
    archiveChannel: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(archiveChannelMutation, archiveChannelOptions);
