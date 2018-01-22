// @flow
import gql from 'graphql-tag';
import userInfoFragment from '../user/userInfo';
import type { UserInfoType } from '../user/userInfo';

export type MessageInfoType = {
  id: string,
  timestamp: Date,
  messageType: string,
  sender: {
    ...$Exact<UserInfoType>,
    isPro: boolean,
    contextPermissions: {
      communityId: string,
      reputation: number,
      isOwner: boolean,
      isModerator: boolean,
    },
  },
  reactions: {
    count: number,
    hasReacted: boolean,
  },
  content: {
    body: string,
  },
};

export default gql`
  fragment messageInfo on Message {
    id
    timestamp
    messageType
    sender {
      ...userInfo
      isPro
      contextPermissions {
        communityId
        reputation
        isOwner
        isModerator
      }
    }
    reactions {
      count
      hasReacted
    }
    content {
      body
    }
  }
  ${userInfoFragment}
`;
