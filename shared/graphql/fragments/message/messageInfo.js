// @flow
import gql from 'graphql-tag';
import type { MessageThreadAttachment } from 'shared/types';
import threadParticipantFragment from '../thread/threadParticipant';
import type { ThreadParticipantType } from '../thread/threadParticipant';

export type MessageInfoType = {
  id: string,
  timestamp: string,
  messageType: string,
  modifiedAt: string,
  bot?: boolean,
  parent: {
    id: string,
    timestamp: Date,
    messageType: string,
    author: {
      ...$Exact<ThreadParticipantType>,
    },
    content: {
      body: string,
    },
  },
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
  attachments: ?Array<MessageThreadAttachment>,
};

export default gql`
  fragment messageInfo on Message {
    id
    timestamp
    modifiedAt
    messageType
    bot
    parent {
      id
      timestamp
      messageType
      author {
        ...threadParticipant
      }
      content {
        body
      }
      attachments {
        attachmentType
        data {
          name
          url
        }
      }
    }
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
    attachments {
      attachmentType
      data {
        name
        url
      }
    }
  }
  ${threadParticipantFragment}
`;
