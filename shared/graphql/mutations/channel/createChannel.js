// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment, {
  type ChannelInfoType,
} from '../../fragments/channel/channelInfo';
import { getCommunityChannelConnectionQuery } from '../../queries/community/getCommunityChannelConnection';

type CreateChannelInput = {
  communityId: string,
  name: string,
  description: string,
  slug: string,
  isPrivate: boolean,
  isDefault: boolean,
};

export type CreateChannelType = {
  data: {
    createChannel: {
      ...$Exact<ChannelInfoType>,
    },
  },
};

export const createChannelMutation = gql`
  mutation createChannel($input: CreateChannelInput!) {
    createChannel(input: $input) {
      ...channelInfo
    }
  }
  ${channelInfoFragment}
`;

const createChannelOptions = {
  props: ({ mutate }) => ({
    createChannel: (input: CreateChannelInput) =>
      mutate({
        variables: {
          input,
        },
        refetchQueries: [
          {
            query: getCommunityChannelConnectionQuery,
            variables: {
              id: input.communityId,
            },
          },
        ],
      }),
  }),
};

export default graphql(createChannelMutation, createChannelOptions);
