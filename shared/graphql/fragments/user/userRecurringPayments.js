// @flow
import gql from 'graphql-tag';

type RP = {
  plan: string,
  amount: number,
  createdAt: Date,
  status: string,
};

export type UserRecurringPaymentsType = {
  recurringPayments: Array<?RP>,
};

export default gql`
  fragment userRecurringPayments on User {
    recurringPayments {
      plan
      amount
      createdAt
      status
    }
  }
`;
