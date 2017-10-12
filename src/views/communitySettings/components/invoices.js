// @flow
import * as React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { connect } from 'react-redux';
import { getCommunityInvoices } from '../../../api/community';
import { Loading } from '../../../components/loading';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { InvoiceListItem } from '../../../components/listItems';
import { sortByDate } from '../../../helpers/utils';
import { SectionCard, SectionTitle } from '../style';
import { ListContainer } from '../../../components/listItems/style';

type InvoiceType = {
  id: string,
  paidAt: string,
  amount: number,
  sourceBrand: string,
  sourceLast4: string,
  planName: string,
};

type Props = {
  data: {
    community: {
      invoices: Array<InvoiceType>,
    },
  },
  isLoading: boolean,
};

class Invoices extends React.Component<Props> {
  render() {
    const { data: { community }, isLoading } = this.props;

    if (community) {
      const { invoices } = community;
      const sortedInvoices = sortByDate(invoices.slice(), 'paidAt', 'desc');
      if (!sortedInvoices || sortedInvoices.length === 0) {
        return null;
      }

      return (
        <SectionCard>
          <SectionTitle>Payment History</SectionTitle>

          <ListContainer style={{ marginTop: '16px' }}>
            {sortedInvoices &&
              sortedInvoices.map(invoice => {
                return <InvoiceListItem invoice={invoice} key={invoice.id} />;
              })}
          </ListContainer>
        </SectionCard>
      );
    }

    if (isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return null;
  }
}

export default compose(getCommunityInvoices, viewNetworkHandler, connect())(
  Invoices
);
