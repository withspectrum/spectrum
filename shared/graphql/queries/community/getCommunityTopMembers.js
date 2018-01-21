// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import userInfoFragment from 'shared/graphql/fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';

type User = {
  ...$Exact<UserInfoType>,
  isPro: boolean,
  contextPermissions: {
    reputation: number,
    isOwner: boolean,
    isModerator: boolean,
  },
};

export type GetCommunityMembersType = {
  ...$Exact<CommunityInfoType>,
  topMembers: Array<?User>,
};

const getCommunityTopMembersQuery = gql`
  query getCommunityTopMembers($id: ID) {
    community(id: $id) {
      ...communityInfo
      topMembers {
        ...userInfo
        isPro
        contextPermissions {
          reputation
          isOwner
          isModerator
        }
      }
    }
  }
  ${communityInfoFragment}
  ${userInfoFragment}
`;

const getCommunityTopMembersOptions = {
  options: ({ id }: { id: string }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(
  getCommunityTopMembersQuery,
  getCommunityTopMembersOptions
);
