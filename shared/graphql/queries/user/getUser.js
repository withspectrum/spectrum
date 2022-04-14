// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';

export type GetUserType = {
  ...$Exact<UserInfoType>,
};

export const getUserByIdQuery = gql`
  query getUserById($id: ID) {
    user(id: $id) {
      ...userInfo
    }
  }
  ${userInfoFragment}
`;

const getUserByIdOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
};

export const getUserByUsernameQuery = gql`
  query getUserByUsername($username: LowercaseString) {
    user(username: $username) {
      ...userInfo
    }
  }
  ${userInfoFragment}
`;

const getUserByUsernameOptions = {
  options: ({ username }) => ({
    variables: {
      username,
    },
  }),
};

const getUserByMatchOptions = {
  options: ({
    match: {
      params: { username },
    },
  }) => ({
    fetchPolicy: 'cache-and-network',
    variables: {
      username,
    },
  }),
};

export const getUserById = graphql(getUserByIdQuery, getUserByIdOptions);
export const getUserByUsername = graphql(
  getUserByUsernameQuery,
  getUserByUsernameOptions
);
export const getUserByMatch = graphql(
  getUserByUsernameQuery,
  getUserByMatchOptions
);

export const getCurrentUserQuery = gql`
  query getCurrentUser {
    user: currentUser {
      ...userInfo
    }
  }
  ${userInfoFragment}
`;

export const getCurrentUser = graphql(getCurrentUserQuery, {
  options: { fetchPolicy: 'cache-first' },
});
