// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';
import userCommunityConnectionFragment from '../../fragments/user/userCommunityConnection';
import type { UserCommunityConnectionType } from '../../fragments/user/userCommunityConnection';

export type GetUserCommunityConnectionType = {
  ...$Exact<UserInfoType>,
  isPro: boolean,
  totalReputation: number,
  ...$Exact<UserCommunityConnectionType>,
};

export const getUserCommunityConnectionQuery = gql`
  query getUserCommunityConnection($id: ID) {
    user(id: $id) {
      ...userInfo
      ...userCommunityConnection
    }
  }
  ${userInfoFragment}
  ${userCommunityConnectionFragment}
`;

export const getCurrentUserCommunityConnectionQuery = gql`
  query getCurrentUserCommunityConnection {
    user: currentUser {
      ...userInfo
      ...userCommunityConnection
    }
  }
  ${userInfoFragment}
  ${userCommunityConnectionFragment}
`;

const getUserCommunityConnectionOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
};

export const getCurrentUserCommunityConnection = graphql(
  getCurrentUserCommunityConnectionQuery,
  { options: { fetchPolicy: 'cache-first' } }
);

export const getUserCommunityConnection = graphql(
  getUserCommunityConnectionQuery,
  getUserCommunityConnectionOptions
);
