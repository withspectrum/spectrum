// @flow
import gql from 'graphql-tag';
import userInfoFragment, { type UserInfoType } from '../user/userInfo';

export type CommunityMemberInfoType = {
  user: {
    ...$Exact<UserInfoType>,
  },
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
    roles
    reputation
  }
  ${userInfoFragment}
`;
