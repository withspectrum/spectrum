// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { userInfoFragment } from './fragments/user/userInfo';
import { invoiceInfoFragment } from './fragments/invoice/invoiceInfo';
import { userSettingsFragment } from './fragments/user/userSettings';

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
  Upgrade a user to Pro
*/
const UPGRADE_TO_PRO_MUTATION = gql`
  mutation upgradeToPro($input: UpgradeToProInput!) {
    upgradeToPro(input: $input) {
      ...userInfo
      recurringPayments {
        plan
        amount
        createdAt
        status
      }
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
      recurringPayments {
        plan
        amount
        createdAt
        status
      }
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
  Get a current user's recurring payments
*/
const GET_CURRENT_USER_RECURRING_PAYMENTS_QUERY = gql`
  query getCurrentUserRecurringPayments {
    user: currentUser {
      ...userInfo
      recurringPayments {
        plan
        amount
        createdAt
        status
      }
    }
  }
  ${userInfoFragment}
`;

export const getCurrentUserRecurringPayments = graphql(
  GET_CURRENT_USER_RECURRING_PAYMENTS_QUERY,
  { options: { fetchPolicy: 'network-only' } }
);

/*
  Loads the sidebar profile component widget independent of the thread feed.
  In the future we can compose these queries together since they are fetching
  such similar data, but for now we're making a decision to keep the data
  queries specific to each component.
*/
export const GET_CURRENT_USER_PROFILE_QUERY = gql`
  query getCurrentUserProfile {
    user: currentUser {
      ...userInfo
      communityConnection {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            id
          }
        }
      }
    }
  }
  ${userInfoFragment}
`;

export const getCurrentUserProfile = graphql(GET_CURRENT_USER_PROFILE_QUERY, {
  options: { fetchPolicy: 'cache-first' },
});

/*
  Delete a thread
*/
const TOGGLE_NOTIFICATION_SETTINGS_MUTATION = gql`
  mutation toggleNotificationSettings($input: ToggleNotificationSettingsInput) {
    toggleNotificationSettings(input: $input) {
      ...userInfo,
      ...userSettings
    }
  }
  ${userInfoFragment}
  ${userSettingsFragment}
`;
const TOGGLE_NOTIFICATION_SETTINGS_OPTIONS = {
  props: ({ input, mutate }) => ({
    toggleNotificationSettings: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};
export const toggleNotificationSettingsMutation = graphql(
  TOGGLE_NOTIFICATION_SETTINGS_MUTATION,
  TOGGLE_NOTIFICATION_SETTINGS_OPTIONS
);

export const CHECK_UNIQUE_USERNAME_QUERY = gql`
  query user($username: String) {
    user(username: $username) {
      id
    }
  }
`;

const GET_USER_INVOICES_OPTIONS = {
  options: ({ id }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'network-only',
  }),
};

const GET_USER_INVOICES_QUERY = gql`
  query getUserInvoices {
    user: currentUser {
      id
      invoices {
        ...invoiceInfo
      }
    }
  }
  ${invoiceInfoFragment}
`;

export const getUserInvoices = graphql(
  GET_USER_INVOICES_QUERY,
  GET_USER_INVOICES_OPTIONS
);

/*
  Upload a new profilePhoto for the given currentUser
*/
const UPDATE_USER_EMAIL_MUTATION = gql`
  mutation updateUserEmail($email: String!) {
    updateUserEmail (email: $email) {
      ...userInfo
      email
      pendingEmail
    }
  }
  ${userInfoFragment}
`;

const UPDATE_USER_EMAIL_OPTIONS = {
  props: ({ email, mutate }) => ({
    updateUserEmail: email =>
      mutate({
        variables: {
          email,
        },
      }),
  }),
};

export const updateUserEmailMutation = graphql(
  UPDATE_USER_EMAIL_MUTATION,
  UPDATE_USER_EMAIL_OPTIONS
);
