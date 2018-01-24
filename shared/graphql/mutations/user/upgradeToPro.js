// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';
import userRecurringPaymentsFragment from '../../fragments/user/userRecurringPayments';
import type { UserRecurringPaymentsType } from '../../fragments/user/userRecurringPayments';

export type UpgradeToProType = {
  ...$Exact<UserInfoType>,
  ...$Exact<UserRecurringPaymentsType>,
};

export const upgradeToProMutation = gql`
  mutation upgradeToPro($input: UpgradeToProInput!) {
    upgradeToPro(input: $input) {
      ...userInfo
      ...userRecurringPayments
    }
  }
  ${userInfoFragment}
  ${userRecurringPaymentsFragment}
`;

const upgradeToProOptions = {
  props: ({ input, mutate }) => ({
    upgradeToPro: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(upgradeToProMutation, upgradeToProOptions);
