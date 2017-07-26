// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { addToastWithTimeout } from '../../../actions/toasts';
import { getCommunityInvoices } from '../../../api/community';
import { displayLoadingCard } from '../../../components/loading';
import { InvoiceListItem } from '../../../components/listItems';
import {
  StyledCard,
  ListHeader,
  LargeListHeading,
  ListContainer,
  ListFooter,
} from '../../../components/listItems/style';
import { UnpaidBadge } from '../style';

class InvoicesPure extends Component {
  render() {
    const { data: { error, community } } = this.props;

    if (!community || community.invoices.length === 0 || error !== undefined) {
      return null;
    }

    const { invoices } = community;

    return (
      <StyledCard>
        <ListHeader>
          <LargeListHeading>Invoices</LargeListHeading>
        </ListHeader>

        <ListContainer>
          {invoices &&
            invoices.map(invoice => {
              return (
                <section key={invoice.id}>
                  <InvoiceListItem invoice={invoice} />
                </section>
              );
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
