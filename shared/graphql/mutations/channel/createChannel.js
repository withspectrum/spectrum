// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment from '../../fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';

type CreateChannelInput = {
  communityId: string,
  name: string,
  description: string,
  slug: string,
  isPrivate: boolean,
  isDefault: boolean,
};

export type CreateChannelType = {
  ...$Exact<ChannelInfoType>,
};

const createChannelMutation = gql`
  mutation createChannel($input: CreateChannelInput!) {
    createChannel(input: $input) {
      ...channelInfo
    }
  }
  ${channelInfoFragment}
`;

const createChannelOptions = {
  props: ({ input, mutate }) => ({
    createChannel: (input: CreateChannelInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(createChannelMutation, createChannelOptions);
