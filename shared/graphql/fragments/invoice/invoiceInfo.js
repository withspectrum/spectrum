// @flow
import gql from 'graphql-tag';

export type InvoiceInfoType = {
  id: string,
  paidAt: ?Date,
  amount: number,
  sourceBrand: string,
  sourceLast4: string,
  planName: string,
};

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
