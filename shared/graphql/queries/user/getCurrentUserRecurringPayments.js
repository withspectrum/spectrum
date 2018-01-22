// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';
import userRecurringPaymentsFragment from '../../fragments/user/userRecurringPayments';
import type { UserRecurringPaymentsType } from '../../fragments/user/userRecurringPayments';

export type GetCurrentUserRecurringPaymentsType = {
  ...$Exact<UserInfoType>,
  ...$Exact<UserRecurringPaymentsType>,
};

const getCurrentUserRecurringPayemntsQuery = gql`
  query getCurrentUserRecurringPayments {
    user: currentUser {
      ...userInfo
      ...userRecurringPayments
    }
  }
  ${userInfoFragment}
  ${userRecurringPaymentsFragment}
`;

export default graphql(getCurrentUserRecurringPayemntsQuery, {
  options: { fetchPolicy: 'network-only' },
});
