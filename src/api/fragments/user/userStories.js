import { gql } from 'react-apollo';
import { storyInfoFragment } from '../story/storyInfo';

export const userStoriesFragment = gql`
  fragment userStories on User {
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
