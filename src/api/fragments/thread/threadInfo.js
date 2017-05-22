import { gql } from 'react-apollo';
import { userInfoFragment } from '../user/userInfo';

export const threadInfoFragment = gql`
  fragment threadInfo on Thread {
    id
    messageCount
    createdAt
    modifiedAt
    isPublished
    isLocked
    isCreator
    channelPermissions {
      isMember
      isPending
      isBlocked
      isOwner
      isModerator
    }
    communityPermissions {
      isMember
      isBlocked
      isOwner
      isModerator
    }
    participants {
      ...userInfo
    }
    content {
      title
      body
    }
    creator {
      ...userInfo
    }
  }
  ${userInfoFragment}
`;
