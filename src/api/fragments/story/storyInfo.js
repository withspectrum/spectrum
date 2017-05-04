import { gql } from 'react-apollo';
import { userInfoFragment } from '../user/userInfo';

export const storyInfoFragment = gql`
  fragment storyInfo on Story {
    id
    messageCount
    createdAt
    modifiedAt
    published
    deleted
    locked
    content {
      title
      description
    }
    author {
      ...userInfo
    }
  }
  ${userInfoFragment}
`;
