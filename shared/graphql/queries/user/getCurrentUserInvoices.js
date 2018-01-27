// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import invoiceInfoFragment from '../../fragments/invoice/invoiceInfo';
import type { InvoiceInfoType } from '../../fragments/invoice/invoiceInfo';

type Invoice = {
  ...$Exact<InvoiceInfoType>,
};

export type GetCurrentUserInvoicesType = {
  id: string,
  invoices: Array<?Invoice>,
};

export const getCurrentUserInvoicesQuery = gql`
  query getUserInvoices {
    user: currentUser {
      id
      invoices {
        ...invoiceInfo
      }
    }
  }
  ${invoiceInfoFragment}
`;

const getCurrentUserInvoicesOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'network-only',
  }),
};

export default graphql(
  getCurrentUserInvoicesQuery,
  getCurrentUserInvoicesOptions
);
