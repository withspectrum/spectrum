// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import invoiceInfoFragment from '../../fragments/invoice/invoiceInfo';
import type { InvoiceInfoType } from '../../fragments/invoice/invoiceInfo';

type Invoice = {
  ...$Exact<InvoiceInfoType>,
};

export type GetCommunityInvoicesType = {
  ...$Exact<CommunityInfoType>,
  invoices: Array<?Invoice>,
};

export const getCommunityInvoicesQuery = gql`
  query getCommunityInvoices($id: ID) {
    community(id: $id) {
      ...communityInfo
      invoices {
        ...invoiceInfo
      }
    }
  }
  ${communityInfoFragment}
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
