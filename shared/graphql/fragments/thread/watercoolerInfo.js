// @flow
import gql from 'graphql-tag';
import userInfoFragment from '../user/userInfo';
import type { UserInfoType } from '../user/userInfo';
import communityInfoFragment, {
  type CommunityInfoType,
} from '../community/communityInfo';
import messageInfoFragment, {
  type MessageInfoType,
} from '../message/messageInfo';
import channelInfoFragment from '../channel/channelInfo';
import threadParticipantFragment from './threadParticipant';
import type { ChannelInfoType } from '../channel/channelInfo';
import type { ThreadMessageConnectionType } from 'shared/graphql/fragments/thread/threadMessageConnection';
import type { ThreadParticipantType } from './threadParticipant';

export type ThreadInfoType = {
  id: string,
  messageCount: number,
  createdAt: string,
  modifiedAt: ?string,
  lastActive: ?string,
  receiveNotifications: boolean,
  currentUserLastSeen: ?string,
  author: {
    ...$Exact<ThreadParticipantType>,
  },
  channel: {
    ...$Exact<ChannelInfoType>,
  },
  community: {
    ...$Exact<CommunityInfoType>,
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
    author {
      ...threadParticipant
    }
    channel {
      ...channelInfo
    }
    community {
      ...communityInfo
      metaData {
        onlineMembers
      }
    }
    isPublished
    isLocked
    isAuthor
    type
    content {
      title
    }
    watercooler
    metaImage
    reactions {
      count
      hasReacted
    }
    lastMessage {
      ...messageInfo
    }
  }
  ${threadParticipantFragment}
  ${userInfoFragment}
  ${channelInfoFragment}
  ${communityInfoFragment}
  ${messageInfoFragment}
`;
