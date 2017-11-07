import { gql } from 'react-apollo';
import { userInfoFragment } from '../user/userInfo';
import { communityInfoFragment } from '../community/communityInfo';
import { channelInfoFragment } from '../channel/channelInfo';

export const threadInfoFragment = gql`
  fragment threadInfo on Thread {
    id
    messageCount
    createdAt
    modifiedAt
    lastActive
    receiveNotifications
    creator {
      ...userInfo
      isPro
      contextPermissions {
        communityId
        reputation
        isOwner
        isModerator
      }
    }
    channel {
      ...channelInfo
    }
    community {
      ...communityInfo
    }
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
    attachments {
      attachmentType
      data
    }
  }
  ${userInfoFragment}
  ${channelInfoFragment}
  ${communityInfoFragment}
`;
