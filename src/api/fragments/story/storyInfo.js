import { gql } from 'react-apollo';
import { userInfoFragment } from '../user/userInfo';

export const storyInfoFragment = gql`
  fragment storyInfo on Story {
    id
    messageCount
    createdAt
    modifiedAt
    published
    locked
    isCreator
    isFrequencyOwner
    isCommunityOwner
    participants {
      ...userInfo
    }
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
