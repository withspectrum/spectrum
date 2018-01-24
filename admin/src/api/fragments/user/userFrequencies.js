import gql from 'graphql-tag';
import { channelInfoFragment } from '../channel/channelInfo';

export const userChannelsFragment = gql`
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
