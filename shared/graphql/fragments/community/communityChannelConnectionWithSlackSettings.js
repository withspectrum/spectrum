// @flow
import gql from 'graphql-tag';
import channelInfoFragment from '../../fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';

type Edge = {
  node: {
    ...$Exact<ChannelInfoType>,
    slackSettings: {
      botLinks: {
        threadCreated: ?string,
      },
    },
  },
};

export type CommunityChannelConnectionWithSlackSettingsType = {
  channelConnection: {
    edges: Array<?Edge>,
  },
};

export default gql`
  fragment communityChannelConnectionWithSlackSettings on Community {
    channelConnection {
      edges {
        node {
          ...channelInfo
          slackSettings {
            botLinks {
              threadCreated
            }
          }
        }
      }
    }
  }
  ${channelInfoFragment}
`;
