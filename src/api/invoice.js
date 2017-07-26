// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { invoiceInfoFragment } from './fragments/invoice/invoiceInfo';

const PAY_INVOICE_MUTATION = gql`
  mutation payInvoice($input: PayInvoiceInput!) {
    payInvoice(input: $input) {
      ...invoiceInfo
    }
  }
  ${invoiceInfoFragment}
`;

const PAY_INVOICE_OPTIONS = {
  props: ({ input, mutate }) => ({
    payInvoice: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export const payInvoiceMutation = graphql(
  PAY_INVOICE_MUTATION,
  PAY_INVOICE_OPTIONS
);
