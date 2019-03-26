// @flow
import gql from 'graphql-tag';
import userInfoFragment from '../user/userInfo';
import communityInfoFragment from '../community/communityInfo';
import type { CommunityInfoType } from '../community/communityInfo';
import communityMetaDataFragment from '../community/communityMetaData';
import type { CommunityMetaDataType } from '../community/communityMetaData';
import threadParticipantFragment from './threadParticipant';
import channelInfoFragment from '../channel/channelInfo';
import type { ChannelInfoType } from '../channel/channelInfo';
import type { ThreadMessageConnectionType } from 'shared/graphql/fragments/thread/threadMessageConnection';
import type { ThreadParticipantType } from './threadParticipant';

type Attachment = {
  attachmentType: string,
  data: string,
  trueUrl: string,
};

export type ThreadInfoType = {
  id: string,
  messageCount: number,
  createdAt: string,
  modifiedAt: ?string,
  lastActive: ?string,
  receiveNotifications: boolean,
  currentUserLastSeen: ?string,
  editedBy?: {
    ...$Exact<ThreadParticipantType>,
  },
  author: {
    ...$Exact<ThreadParticipantType>,
  },
  channel: {
    ...$Exact<ChannelInfoType>,
  },
  community: {
    ...$Exact<CommunityInfoType>,
    ...$Exact<CommunityMetaDataType>,
  },
  // $FlowFixMe: We need to remove `messageConnection` from ThreadMessageConnectionType. This works in the meantime.
  ...$Exact<ThreadMessageConnectionType>,
  isPublished: boolean,
  isLocked: boolean,
  isAuthor: boolean,
  type: string,
  content: {
    title: string,
    body: string,
  },
  attachments: Array<?Attachment>,
  watercooler: boolean,
  metaImage: string,
  reactions: {
    count: number,
    hasReacted: boolean,
  },
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
    editedBy {
      ...threadParticipant
    }
    author {
      ...threadParticipant
    }
    channel {
      ...channelInfo
    }
    community {
      ...communityInfo
      ...communityMetaData
    }
    isPublished
    isLocked
    isAuthor
    type
    content {
      title
      body
    }
    attachments {
      attachmentType
      data
    }
    watercooler
    metaImage
    reactions {
      count
      hasReacted
    }
  }
  ${threadParticipantFragment}
  ${userInfoFragment}
  ${channelInfoFragment}
  ${communityInfoFragment}
  ${communityMetaDataFragment}
`;
