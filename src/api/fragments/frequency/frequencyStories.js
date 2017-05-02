import { gql } from 'react-apollo';
import { storyInfoFragment } from '../story/storyInfo';

export const frequencyStoriesFragment = gql`
  fragment frequencyStories on Frequency {
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
