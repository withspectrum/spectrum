// @flow
import gql from 'graphql-tag';
import userInfoFragment from '../user/userInfo';
import type { UserInfoType } from '../user/userInfo';

export type ThreadParticipantType = {
  id: string,
  user: {
    ...$Exact<UserInfoType>,
  },
  isMember: boolean,
  isModerator: boolean,
  isBlocked: boolean,
  isOwner: boolean,
  roles: Array<string>,
  reputation: number,
};

export default gql`
  fragment threadParticipant on ThreadParticipant {
    user {
      ...userInfo
    }
    isMember
    isModerator
    isBlocked
    isOwner
    roles
    reputation
  }
  ${userInfoFragment}
`;
