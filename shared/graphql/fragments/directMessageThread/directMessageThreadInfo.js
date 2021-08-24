// @flow
import gql from 'graphql-tag';
import type { UserInfoType } from '../user/userInfo';

export type ParticipantType = {
  ...$Exact<UserInfoType>,
  userId: string,
};

export type DirectMessageThreadInfoType = {
  id: string,
  snippet: string,
  threadLastActive: Date,
  participants: Array<ParticipantType>,
};

export default gql`
  fragment directMessageThreadInfo on DirectMessageThread {
    id
    snippet
    threadLastActive
    participants {
      id
      name
      profilePhoto
      username
      userId
    }
  }
`;
