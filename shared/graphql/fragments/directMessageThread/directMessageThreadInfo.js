// @flow
import gql from 'graphql-tag';
import type { UserInfoType } from '../user/userInfo';

export type ParticipantType = {
  ...$Exact<UserInfoType>,
  userId: string,
  lastSeen: string,
};

export type DirectMessageThreadInfoType = {
  id: string,
  threadLastActive: Date,
  isArchived: boolean,
  isMuted: boolean,
  isGroup: boolean,
  snippet: string,
  participants: Array<ParticipantType>,
};

export default gql`
  fragment directMessageThreadInfo on DirectMessageThread {
    id
    isArchived
    isMuted
    isGroup
    snippet
    threadLastActive
    participants {
      id
      name
      profilePhoto
      username
      lastSeen
      lastActive
      userId
      isOnline
    }
  }
`;
