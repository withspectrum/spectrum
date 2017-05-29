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

/*
  Upgrade a user to Pro
*/
const UPGRADE_TO_PRO_MUTATION = gql`
  mutation upgradeToPro($input: UpgradeToProInput!) {
    upgradeToPro(input: $input) {
      ...userInfo
    }
  }
  ${userInfoFragment}
`;

const UPGRADE_TO_PRO_OPTIONS = {
  props: ({ input, mutate }) => ({
    upgradeToPro: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export const upgradeToProMutation = graphql(
  UPGRADE_TO_PRO_MUTATION,
  UPGRADE_TO_PRO_OPTIONS
);

/*
  Downgrade from pro
*/
const DOWNGRADE_FROM_PRO_MUTATION = gql`
  mutation downgradeFromPro {
    downgradeFromPro {
      ...userInfo
    }
  }
  ${userInfoFragment}
`;

const DOWNGRADE_FROM_PRO_OPTIONS = {
  props: ({ input, mutate }) => ({
    downgradeFromPro: () => mutate(),
  }),
};

export const downgradeFromProMutation = graphql(
  DOWNGRADE_FROM_PRO_MUTATION,
  DOWNGRADE_FROM_PRO_OPTIONS
);

/*
  Get a current user's subscriptions
*/
const GET_CURRENT_USER_SUBSCRIPTIONS_QUERY = gql`
  query getCurrentUserSubscriptions {
    user: currentUser {
      ...userInfo
      subscriptions {
        plan
        amount
        created
        status
      }
    }
  }
  ${userInfoFragment}
`;

export const getCurrentUserSubscriptions = graphql(
  GET_CURRENT_USER_SUBSCRIPTIONS_QUERY
);
