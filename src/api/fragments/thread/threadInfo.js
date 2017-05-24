import { gql } from 'react-apollo';
import { userInfoFragment } from '../user/userInfo';

export const threadInfoFragment = gql`
  fragment threadInfo on Thread {
    id
    messageCount
    createdAt
    modifiedAt
    channel {
      id
      name
    }
    community {
      id
      name
    }
    isPublished
    isLocked
    isCreator
    isChannelOwner
    isCommunityOwner
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
