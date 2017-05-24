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
		type
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
