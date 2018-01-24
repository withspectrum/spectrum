// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';
import userSettingsFragment from '../../fragments/user/userSettings';
import type { UserSettingsType } from '../../fragments/user/userSettings';

export type ToggleUserNotificationSettingsType = {
  ...$Exact<UserInfoType>,
  ...$Exact<UserSettingsType>,
};

export const toggleNotificationSettingsMutation = gql`
  mutation toggleNotificationSettings($input: ToggleNotificationSettingsInput) {
    toggleNotificationSettings(input: $input) {
      ...userInfo
      ...userSettings
    }
  }
  ${userInfoFragment}
  ${userSettingsFragment}
`;

type InputType = {
  deliveryMethod: string,
  notificationType: string,
};

const toggleNotificationSettingsOptions = {
  props: ({ mutate }) => ({
    toggleNotificationSettings: (input: InputType) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  toggleNotificationSettingsMutation,
  toggleNotificationSettingsOptions
);
