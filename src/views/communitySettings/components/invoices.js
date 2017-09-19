// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { getCommunityInvoices } from '../../../api/community';
import { displayLoadingCard } from '../../../components/loading';
import { InvoiceListItem } from '../../../components/listItems';
import { sortByDate } from '../../../helpers/utils';
import {
  StyledCard,
  LargeListHeading,
  ListContainer,
} from '../../../components/listItems/style';

class InvoicesPure extends Component {
  render() {
    const { data: { error, community } } = this.props;

    if (!community || community.invoices.length === 0 || error !== undefined) {
      return null;
    }

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
}

const Invoices = compose(
  getCommunityInvoices,
  displayLoadingCard,
  connect(),
  pure
)(InvoicesPure);

export default Invoices;
