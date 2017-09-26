// @flow
import * as React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { getCommunityInvoices } from '../../../api/community';
import { LoadingCard } from '../../../components/loading';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { InvoiceListItem } from '../../../components/listItems';
import { sortByDate } from '../../../helpers/utils';
import {
  StyledCard,
  LargeListHeading,
  ListContainer,
} from '../../../components/listItems/style';

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
  hasError: boolean,
};

class Invoices extends React.Component<Props> {
  render() {
    const { data: { community }, isLoading, hasError } = this.props;

    if (community) {
      const { invoices } = community;
      const sortedInvoices = sortByDate(invoices.slice(), 'paidAt', 'desc');

      return (
        <StyledCard>
          <LargeListHeading>Payment History</LargeListHeading>

          <ListContainer style={{ marginTop: '16px' }}>
            {sortedInvoices &&
              sortedInvoices.map(invoice => {
                return <InvoiceListItem invoice={invoice} key={invoice.id} />;
              })}
          </ListContainer>
        </StyledCard>
      );
    }

    if (isLoading) {
      return <LoadingCard />;
    }

    return null;
  }
}

export default compose(
  getCommunityInvoices,
  viewNetworkHandler,
  connect(),
  pure
)(Invoices);
