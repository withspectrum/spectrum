import { gql } from 'react-apollo';
import { threadInfoFragment } from '../thread/threadInfo';
import { channelInfoFragment } from '../channel/channelInfo';
import { communityInfoFragment } from '../community/communityInfo';

export const communityThreadsFragment = gql`
  fragment communityThreads on Community {
    threadConnection(first: 10, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          ...threadInfo
        }
      }
    }
  }
  ${threadInfoFragment}
`;
