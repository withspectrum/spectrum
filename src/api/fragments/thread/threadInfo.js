import { gql } from 'react-apollo';
import { userInfoFragment } from '../user/userInfo';
import { communityInfoFragment } from '../community/communityInfo';
import { channelInfoFragment } from '../channel/channelInfo';
import { channelMetaDataFragment } from '../channel/channelMetaData';

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
      contextPermissions {
        reputation
        isOwner
        isModerator
      }
    }
    channel {
      ...channelInfo
      ...channelMetaData
      community {
        ...communityInfo
      }
    }
    community {
      id
      name
      slug
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
  ${userInfoFragment}
  ${channelMetaDataFragment}
  ${channelInfoFragment}
  ${communityInfoFragment}
`;
