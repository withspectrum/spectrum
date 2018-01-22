// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';
import userRecurringPaymentsFragment from '../../fragments/user/userRecurringPayments';
import type { UserRecurringPaymentsType } from '../../fragments/user/userRecurringPayments';

export type DowngradeFromProType = {
  ...$Exact<UserInfoType>,
  ...$Exact<UserRecurringPaymentsType>,
};

const downgradeFromProMutation = gql`
  mutation downgradeFromPro {
    downgradeFromPro {
      ...userInfo
      ...userRecurringPayments
    }
  }
  ${userInfoFragment}
  ${userRecurringPaymentsFragment}
`;

const downgradeFromProOptions = {
  props: ({ mutate }) => ({
    downgradeFromPro: () => mutate(),
  }),
};

export default graphql(downgradeFromProMutation, downgradeFromProOptions);
