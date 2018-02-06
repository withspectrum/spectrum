// @flow
import gql from 'graphql-tag';
import userInfoFragment from '../user/userInfo';
import type { UserInfoType } from '../user/userInfo';

export type DirectMessageInfoType = {
  id: string,
  timestamp: Date,
  messageType: string,
  sender: {
    user: {
      ...$Exact<UserInfoType>,
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
  fragment directMessageInfo on Message {
    id
    timestamp
    messageType
    sender {
      user {
        ...userInfo
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
