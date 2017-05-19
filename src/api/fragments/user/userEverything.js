import { gql } from 'react-apollo';
import { threadInfoFragment } from '../thread/threadInfo';
import { channelInfoFragment } from '../channel/channelInfo';
import { communityInfoFragment } from '../community/communityInfo';

export const userEverythingFragment = gql`
  fragment userEverything on User {
    everything(first: 10, after: $after){
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          ...threadInfo
          messageCount
          channel {
            ...channelInfo
            community {
              ...communityInfo
            }
          }
        }
      }
    }
  }
  ${threadInfoFragment}
  ${channelInfoFragment}
  ${communityInfoFragment}
`;
