// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import invoiceInfoFragment from '../../fragments/invoice/invoiceInfo';

const getCommunityInvoicesQuery = gql`
  query getCommunityInvoices($id: ID) {
    community(id: $id) {
      id
      invoices {
        ...invoiceInfo
      }
    }
  }
  ${invoiceInfoFragment}
`;

const getCommunityInvoicesOptions = {
  options: ({ id }: { id: string }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'network-only',
  }),
};

export default graphql(getCommunityInvoicesQuery, getCommunityInvoicesOptions);
