// @flow
import gql from 'graphql-tag';
import threadParticipantFragment from '../thread/threadParticipant';
import type { ThreadParticipantType } from '../thread/threadParticipant';

export type MessageInfoType = {
  id: string,
  timestamp: Date,
  messageType: string,
  author: {
    ...$Exact<ThreadParticipantType>,
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
    author {
      ...threadParticipant
    }
    reactions {
      count
      hasReacted
    }
    content {
      body
    }
  }
  ${threadParticipantFragment}
`;
