// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { userInfoFragment } from './fragments/user/userInfo';

/*
  Upload a new profilePhoto for the given currentUser
*/
const UPLOAD_PROFILE_PHOTO_MUTATION = gql`
  mutation uploadProfilePhoto($file: File!) {
    uploadProfilePhoto (file: $file) {
      ...userInfo
    }
  }
  ${userInfoFragment}
`;

const UPLOAD_PROFILE_PHOTO_OPTIONS = {
  props: ({ file, mutate }) => ({
    uploadProfilePhoto: file =>
      mutate({
        variables: {
          file,
        },
      })
        .then(({ data }) => {
          return;
        })
        .catch(error => {
          return;
        }),
  }),
};

export const uploadProfilePhotoMutation = graphql(
  UPLOAD_PROFILE_PHOTO_MUTATION,
  UPLOAD_PROFILE_PHOTO_OPTIONS
);

export const SEARCH_USERS_QUERY = gql`
  query searchUsers($string: String) {
    searchUsers(string: $string) {
      ...userInfo
    }
  }
  ${userInfoFragment}
`;

/*
  Edit a user
*/
const EDIT_USER_MUTATION = gql`
  mutation editUser($input: EditUserInput!) {
    editUser (input: $input) {
      ...userInfo
    }
  }
  ${userInfoFragment}
`;

const EDIT_USER_OPTIONS = {
  props: ({ input, mutate }) => ({
    editUser: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export const editUserMutation = graphql(EDIT_USER_MUTATION, EDIT_USER_OPTIONS);

/*
  Checks a slug against the db to make sure a community with that slug
  doesn't already exist
*/
export const CHECK_UNIQUE_USERNAME_QUERY = gql`
  query user($username: String) {
    user(username: $username) {
      ...userInfo
    }
  }
  ${userInfoFragment}
`;
