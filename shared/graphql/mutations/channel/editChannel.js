// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment from '../../fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';

export type EditChannelType = {
  data: {
    editChannel: {
      ...$Exact<ChannelInfoType>,
    },
  },
};

type EditChannelInput = {
  channelId: string,
  name: string,
  description: string,
  slug: string,
  isPrivate: Boolean,
};

export const editChannelMutation = gql`
  mutation editChannel($input: EditChannelInput!) {
    editChannel(input: $input) {
      ...channelInfo
    }
  }
  ${channelInfoFragment}
`;

const editChannelOptions = {
  props: ({ mutate }) => ({
    editChannel: (input: EditChannelInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(editChannelMutation, editChannelOptions);
