// @flow
// $FlowFixMe
import { gql } from 'react-apollo';

export const invoiceInfoFragment = gql`
  fragment invoiceInfo on Invoice {
    id
    createdAt
    paidAt
    note
    amount
  }
`;
