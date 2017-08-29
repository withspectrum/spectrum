// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { getUserInvoices } from '../../../api/user';
import { displayLoadingCard } from '../../../components/loading';
import { InvoiceListItem } from '../../../components/listItems';
import {
  StyledCard,
  LargeListHeading,
  ListContainer,
  Description,
} from '../../../components/listItems/style';

class InvoicesPure extends Component {
  render() {
    const { data: { error, user } } = this.props;

    if (!user || user.invoices.length === 0 || error !== undefined) {
      return null;
    }

    const { invoices } = user;

    return (
      <StyledCard>
        <LargeListHeading>Payment History</LargeListHeading>

        <ListContainer style={{ marginTop: '16px' }}>
          {invoices &&
            invoices.map(invoice => {
              return <InvoiceListItem invoice={invoice} key={invoice.id} />;
            })}
        </ListContainer>
      </StyledCard>
    );
  }
}

const Invoices = compose(getUserInvoices, displayLoadingCard, connect(), pure)(
  InvoicesPure
);

export default Invoices;
