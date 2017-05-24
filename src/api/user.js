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
