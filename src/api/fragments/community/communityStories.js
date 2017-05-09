import { gql } from 'react-apollo';
import { storyInfoFragment } from '../story/storyInfo';
import { messageInfoFragment } from '../message/messageInfo';
import { frequencyInfoFragment } from '../frequency/frequencyInfo';
import { communityInfoFragment } from '../community/communityInfo';

export const communityStoriesFragment = gql`
  fragment communityStories on Community {
    storyConnection(first: 10, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          ...storyInfo
          frequency {
            ...frequencyInfo
            community {
              ...communityInfo
            }
          }
          messageConnection {
            edges {
              node {
                ...messageInfo
              }
            }
          }
        }
      }
    }
  }
  ${storyInfoFragment}
  ${messageInfoFragment}
  ${frequencyInfoFragment}
  ${communityInfoFragment}
`;
