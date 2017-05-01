import { gql } from 'react-apollo';
import { storyInfoFragment } from '../story/storyInfo';

export const userStoryFragment = gql`
  fragment userStories on User {
    storyConnection {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...storyInfo
        }
      }
    }
  }
  ${storyInfoFragment}
`;
