import { gql } from 'react-apollo';
import { storyInfoFragment } from '../story/storyInfo';

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
        }
      }
    }
  }
  ${storyInfoFragment}
`;
