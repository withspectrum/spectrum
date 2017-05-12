import { gql } from 'react-apollo';
import { storyInfoFragment } from '../story/storyInfo';
import { frequencyInfoFragment } from '../frequency/frequencyInfo';
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
          ...storyInfo
          messageCount
          frequency {
            ...frequencyInfo
            community {
              ...communityInfo
            }
          }
        }
      }
    }
  }
  ${storyInfoFragment}
  ${frequencyInfoFragment}
  ${communityInfoFragment}
`;
