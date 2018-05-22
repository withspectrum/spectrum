// @flow
import gql from 'graphql-tag';
import userInfoFragment, { type UserInfoType } from '../user/userInfo';

export type CommunityMemberInfoType = {
  user: {
    ...$Exact<UserInfoType>,
  },
  isMember: boolean,
  isModerator: boolean,
  isBlocked: boolean,
  isOwner: boolean,
  isPending: boolean,
  roles: Array<string>,
  reputation: number,
};

export default gql`
  fragment communityMemberInfo on CommunityMember {
    id
    user {
      ...userInfo
    }
    isMember
    isModerator
    isBlocked
    isOwner
    isPending
    roles
    reputation
  }
  ${userInfoFragment}
`;
