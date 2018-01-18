// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from '../../fragments/user/userInfo';

export const getUserByIdQuery = gql`
  query getUser($id: ID) {
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

export const getUserById = graphql(getUserByIdQuery, getUserByIdOptions);

export const getUserByUsernameQuery = gql`
  query getUser($username: String) {
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

export const getUserByUsername = graphql(
  getUserByUsernameQuery,
  getUserByUsernameOptions
);
