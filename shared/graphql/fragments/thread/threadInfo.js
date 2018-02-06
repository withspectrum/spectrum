// @flow
import gql from 'graphql-tag';
import userInfoFragment from '../user/userInfo';
import type { UserInfoType } from '../user/userInfo';
import communityInfoFragment from '../community/communityInfo';
import type { CommunityInfoType } from '../community/communityInfo';
import channelInfoFragment from '../channel/channelInfo';
import type { ChannelInfoType } from '../channel/channelInfo';
import threadParticipantFragment from './threadParticipant';
import type { ThreadParticipantType } from './threadParticipant';

type Participant = {
  ...$Exact<UserInfoType>,
};

type Attachment = {
  attachmentType: string,
  data: string,
  trueUrl: string,
};

export type ThreadInfoType = {
  id: string,
  messageCount: number,
  createdAt: Date,
  modifiedAt: ?Date,
  lastActive: ?Date,
  receiveNotifications: boolean,
  currentUserLastSeen: ?Date,
  author: {
    ...$Exact<ThreadParticipantType>,
  },
  channel: {
    ...$Exact<ChannelInfoType>,
  },
  community: {
    ...$Exact<CommunityInfoType>,
  },
  isPublished: boolean,
  isLocked: boolean,
  isAuthor: boolean,
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
    author {
      ...threadParticipant
    }
    channel {
      ...channelInfo
    }
    community {
      ...communityInfo
    }
    isPublished
    isLocked
    isAuthor
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
  ${threadParticipantFragment}
  ${userInfoFragment}
  ${channelInfoFragment}
  ${communityInfoFragment}
`;
