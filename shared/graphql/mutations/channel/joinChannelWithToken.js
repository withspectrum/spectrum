// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment from '../../fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';

export type joinChannelWithTokenType = {
  data: {
    joinChannelWithToken: {
      ...$Exact<ChannelInfoType>,
    },
  },
};

export const joinChannelWithTokenMutation = gql`
  mutation joinChannelWithToken($input: JoinChannelWithTokenInput!) {
    joinChannelWithToken(input: $input) {
      ...channelInfo
    }
  }
  ${channelInfoFragment}
`;

const joinChannelWithTokenOptions = {
  options: {
    refetchQueries: ['getCurrentCommunityConnection'],
  },
  props: ({ mutate }) => ({
    joinChannelWithToken: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  joinChannelWithTokenMutation,
  joinChannelWithTokenOptions
);
