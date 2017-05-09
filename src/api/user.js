// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { userInfoFragment } from './fragments/user/userInfo';

/*
  Upload a new photoURL for the given currentUser
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
          console.log('mutation complete ', data);
        })
        .catch(error => {
          console.log('error uploading profile photo', error);
        }),
  }),
};

export const uploadProfilePhotoMutation = graphql(
  UPLOAD_PROFILE_PHOTO_MUTATION,
  UPLOAD_PROFILE_PHOTO_OPTIONS
);
