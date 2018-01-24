// @flow
import gql from 'graphql-tag';
import userInfoFragment from '../user/userInfo';
import type { UserInfoType } from '../user/userInfo';
import communityInfoFragment from '../community/communityInfo';
import type { CommunityInfoType } from '../community/communityInfo';
import channelInfoFragment from '../channel/channelInfo';
import type { ChannelInfoType } from '../channel/channelInfo';

type Participant = {
  ...$Exact<UserInfoType>,
};

type Attachment = {
  attachmentType: string,
  data: string,
};

export type ThreadInfoType = {
  id: string,
  messageCount: number,
  createdAt: Date,
  modifiedAt: ?Date,
  lastActive: ?Date,
  receiveNotifications: boolean,
  currentUserLastSeen: ?Date,
  creator: {
    ...$Exact<UserInfoType>,
    contextPermissions: {
      communityId: string,
      reputation: number,
      isOwner: boolean,
      isModerator: boolean,
    },
  },
  channel: {
    ...$Exact<ChannelInfoType>,
  },
  community: {
    ...$Exact<CommunityInfoType>,
  },
  isPublished: boolean,
  isLocked: boolean,
  isCreator: boolean,
  type: string,
  participants: Array<?Participant>,
  content: {
    title: string,
    body: string,
  },
  attachments: Array<?Attachment>,
  watercooler: boolean,
};

export default gql`
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
