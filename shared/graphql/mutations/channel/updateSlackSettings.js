// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment from 'shared/graphql/fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';

type Connection = {
  eventType: string,
  slackChannelId: ?string,
};

export type UpdateSlackSettingsType = {
  data: {
    updateSlackSettings: {
      ...$Exact<ChannelInfoType>,
      slackSettings: {
        botConnection: Array<Connection>,
      },
    },
  },
};

export const updateSlackSettingsMutation = gql`
  mutation updateSlackSettings($input: UpdateSlackSettingsInput!) {
    updateSlackSettings(input: $input) {
      ...channelInfo
    }
    slackSettings {
      botConnection {
        eventType
        slackChannelId
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
