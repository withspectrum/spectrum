// @flow
import gql from 'graphql-tag';
import userInfoFragment from '../user/userInfo';
import type { UserInfoType } from '../user/userInfo';

export type DirectMessageInfoType = {
  id: string,
  timestamp: Date,
  messageType: string,
  modifiedAt: string,
  author: {
    user: {
      ...$Exact<UserInfoType>,
    },
  },
  parent: {
    id: string,
    timestamp: Date,
    messageType: string,
    author: {
      user: {
        ...$Exact<UserInfoType>,
      },
    },
    content: {
      body: string,
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
    modifiedAt
    author {
      user {
        ...userInfo
      }
    }
    parent {
      id
      timestamp
      messageType
      author {
        user {
          ...userInfo
        }
      }
      content {
        body
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
