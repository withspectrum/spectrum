import { gql } from 'react-apollo';
import { userFragments } from './user';

export const storyFragments = {
  storyInfo: gql`
    fragment storyInfo on Story {
      id
      messageCount
      author {
        ...userInfo
      }
      content {
        title
        description
      }
    }
    ${userFragments.userInfo}
  `,
};
