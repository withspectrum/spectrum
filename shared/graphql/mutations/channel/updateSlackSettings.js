// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment from 'shared/graphql/fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';

export type UpdateSlackSettingsType = {
  data: {
    updateSlackSettings: {
      ...$Exact<ChannelInfoType>,
      slackSettings: {
        botLinks: {
          threadCreated: ?string,
        },
      },
    },
  },
};

export const updateSlackSettingsMutation = gql`
  mutation updateSlackSettings($input: UpdateSlackSettingsInput!) {
    updateSlackSettings(input: $input) {
      ...channelInfo
      slackSettings {
        botLinks {
          eventType
          slackChannelId
        }
      }
    }
  }
  ${channelInfoFragment}
`;

const updateSlackSettingsOptions = {
  props: ({ mutate }) => ({
    updateSlackSettings: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(updateSlackSettingsMutation, updateSlackSettingsOptions);
