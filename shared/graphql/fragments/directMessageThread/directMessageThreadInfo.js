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
  participants: Array<ParticipantType>,
};

export default gql`
  fragment directMessageThreadInfo on DirectMessageThread {
    id
    snippet
    participants {
      id
      name
      profilePhoto
      username
      userId
    }
  }
`;
