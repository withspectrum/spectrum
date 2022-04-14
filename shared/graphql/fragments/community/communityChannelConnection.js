// @flow
import gql from 'graphql-tag';
import channelInfoFragment from '../../fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';

type Edge = {
  node: {
    ...$Exact<ChannelInfoType>,
  },
};

export type CommunityChannelConnectionType = {
  channelConnection: {
    edges: Array<?Edge>,
  },
};

export default gql`
  fragment communityChannelConnection on Community {
    channelConnection {
      edges {
        node {
          ...channelInfo
        }
      }
    }
  }
  ${channelInfoFragment}
`;
