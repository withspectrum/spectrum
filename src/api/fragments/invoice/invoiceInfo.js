// @flow
// $FlowFixMe
import { gql } from 'react-apollo';

export const invoiceInfoFragment = gql`
  fragment invoiceInfo on Invoice {
    id
    paidAt
    amount
    sourceBrand
    sourceLast4
    planName
  }
`;
