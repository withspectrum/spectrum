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
  Description,
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
        <LargeListHeading>Community Billing</LargeListHeading>
        <Description>
          Communities are billed 10¢ per member, per month.
        </Description>

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

const Invoices = compose(
  getCommunityInvoices,
  displayLoadingCard,
  connect(),
  pure
)(InvoicesPure);

export default Invoices;
