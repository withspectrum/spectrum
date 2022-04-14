// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment, {
  type ChannelInfoType,
} from '../../fragments/channel/channelInfo';

export type ResetChannelJoinTokenType = {
  data: {
    channel: {
      ...$Exact<ChannelInfoType>,
      joinSettings: {
        tokenJoinEnabled: boolean,
        token: string,
      },
    },
  },
};

export const resetChannelJoinTokenMutation = gql`
  mutation resetChannelJoinToken($input: ResetChannelJoinTokenInput!) {
    resetChannelJoinToken(input: $input) {
      ...channelInfo
      joinSettings {
        tokenJoinEnabled
        token
      }
    }
  }
  ${channelInfoFragment}
`;

const resetChannelJoinTokenOptions = {
  props: ({ mutate }) => ({
    resetChannelJoinToken: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  resetChannelJoinTokenMutation,
  resetChannelJoinTokenOptions
);
