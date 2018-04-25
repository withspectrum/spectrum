// @flow
import gql from 'graphql-tag';
import channelInfoFragment from '../../fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';

type Edge = {
  node: {
    ...$Exact<ChannelInfoType>,
  },
};

type Connection = {
  eventType: string,
  slackChannelId: ?string,
};

export type CommunityChannelConnectionWithSlackSettingsType = {
  channelConnection: {
    edges: Array<?Edge>,
    slackSettings: {
      botConnection: Array<Connection>,
    },
  },
};

export default gql`
  fragment communityChannelConnectionWithSlackSettings on Community {
    channelConnection {
      edges {
        node {
          ...channelInfo
          slackSettings {
            botConnection {
              eventType
              slackChannelId
            }
          }
        }
      }
    }
  }
  ${channelInfoFragment}
`;
