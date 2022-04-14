// @flow
import gql from 'graphql-tag';
import channelInfoFragment from '../channel/channelInfo';
import type { ChannelInfoType } from '../channel/channelInfo';

type Edge = {
  node: {
    ...$Exact<ChannelInfoType>,
  },
};

export type UserChannelConnectionType = {
  channelConnection: {
    pageInfo: {
      hasNextPage: boolean,
      hasPreviousPage: boolean,
    },
    edges: Array<?Edge>,
  },
};

export default gql`
  fragment userChannels on User {
    channelConnection {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...channelInfo
        }
      }
    }
  }
  ${channelInfoFragment}
`;
