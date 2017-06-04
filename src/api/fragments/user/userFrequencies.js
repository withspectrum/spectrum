import { gql } from 'react-apollo';
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
