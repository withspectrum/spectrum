// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment from 'shared/graphql/fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';

export type UpdateChannelSlackBotConnectionType = {
  data: {
    updateChannelSlackBotConnection: {
      ...$Exact<ChannelInfoType>,
      slackSettings: {
        botConnection: {
          threadCreated: ?string,
        },
      },
    },
  },
};

export const updateChannelSlackBotConnectionMutation = gql`
  mutation updateChannelSlackBotConnection(
    $input: UpdateChannelSlackBotConnectionInput
  ) {
    updateChannelSlackBotConnection(input: $input) {
      ...channelInfo
      slackSettings {
        botConnection {
          threadCreated
        }
      }
    }
  }
  ${channelInfoFragment}
`;

const updateChannelSlackBotConnectionOptions = {
  props: ({ mutate }) => ({
    updateChannelSlackBotConnection: (input: Object) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  updateChannelSlackBotConnectionMutation,
  updateChannelSlackBotConnectionOptions
);
