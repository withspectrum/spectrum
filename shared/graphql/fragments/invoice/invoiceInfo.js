// @flow
import gql from 'graphql-tag';

export default gql`
  fragment invoiceInfo on Invoice {
    id
    paidAt
    amount
    sourceBrand
    sourceLast4
    planName
  }
`;
