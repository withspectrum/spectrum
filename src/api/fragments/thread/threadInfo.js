import gql from 'graphql-tag';

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
    currentUserLastSeen
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
    watercooler
  }
  ${userInfoFragment}
  ${channelInfoFragment}
  ${communityInfoFragment}
`;
