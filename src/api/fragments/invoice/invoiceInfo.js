import gql from 'graphql-tag';

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
