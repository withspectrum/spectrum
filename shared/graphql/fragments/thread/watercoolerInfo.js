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

export type WatercoolerInfoType = {
  id: string,
  messageCount: number,
  createdAt: string,
  modifiedAt: ?string,
  lastActive: ?string,
  receiveNotifications: boolean,
  currentUserLastSeen: ?string,
  isPublished: boolean,
  isLocked: boolean,
  isAuthor: boolean,
  type: string,
  community: {
    ...$Exact<CommunityInfoType>,
    metaData: {
      onlineMembers: number,
    },
  },
  content: {
    title: string,
  },
  watercooler: boolean,
  metaImage: string,
  reactions: {
    count: number,
    hasReacted: boolean,
  },
};

export default gql`
  fragment watercoolerInfo on Thread {
    id
    messageCount
    createdAt
    modifiedAt
    lastActive
    receiveNotifications
    currentUserLastSeen
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
  ${messageInfoFragment}
  ${communityInfoFragment}
`;
