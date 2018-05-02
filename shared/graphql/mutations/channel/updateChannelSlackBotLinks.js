// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment from 'shared/graphql/fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';

export type UpdateChannelSlackBotLinksType = {
  data: {
    updateChannelSlackBotLinks: {
      ...$Exact<ChannelInfoType>,
      slackSettings: {
        botLinks: {
          threadCreated: ?string,
        },
      },
    },
  },
};

export const updateChannelSlackBotLinksMutation = gql`
  mutation updateChannelSlackBotLinks($input: UpdateChannelSlackBotLinksInput) {
    updateChannelSlackBotLinks(input: $input) {
      ...channelInfo
      slackSettings {
        botLinks {
          threadCreated
        }
      }
    }
  }
  ${channelInfoFragment}
`;

const updateChannelSlackBotLinksOptions = {
  props: ({ mutate }) => ({
    updateChannelSlackBotLinks: (input: Object) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  updateChannelSlackBotLinksMutation,
  updateChannelSlackBotLinksOptions
);
