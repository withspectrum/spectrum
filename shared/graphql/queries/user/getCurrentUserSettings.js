// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';
import userSettingsFragment from '../../fragments/user/userSettings';
import type { UserSettingsType } from '../../fragments/user/userSettings';

export type GetCurrentUserSettingsType = {
  ...$Exact<UserInfoType>,
  email: ?string,
  pendingEmail: ?string,
  ...$Exact<UserSettingsType>,
};

export const getCurrentUserSettings = gql`
  query getCurrentUserSettings {
    user: currentUser {
      ...userInfo
      email
      pendingEmail
      ...userSettings
    }
  }
  ${userInfoFragment}
  ${userSettingsFragment}
`;

export default graphql(getCurrentUserSettings, {
  options: { fetchPolicy: 'network-only' },
});
