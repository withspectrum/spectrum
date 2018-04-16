// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import getUserInvoices from 'shared/graphql/queries/user/getCurrentUserInvoices';
import type { GetCurrentUserInvoicesType } from 'shared/graphql/queries/user/getCurrentUserInvoices';
import { displayLoadingCard } from 'src/components/loading';
import { InvoiceListItem } from 'src/components/listItems';
import { sortByDate } from 'src/helpers/utils';
import { ListContainer } from 'src/components/listItems/style';
import { SectionCard, SectionTitle } from 'src/components/settingsViews/style';

type Props = {
  data: {
    user: GetCurrentUserInvoicesType,
    error: boolean,
  },
};

class InvoicesPure extends React.Component<Props> {
  render() {
    const { data: { error, user } } = this.props;

    if (!user || user.invoices.length === 0 || error !== undefined) {
      return null;
    }

    const { invoices } = user;
    const sortedInvoices = sortByDate(invoices.slice(), 'paidAt', 'desc');

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
}

const Invoices = compose(getUserInvoices, displayLoadingCard, connect())(
  InvoicesPure
);

export default Invoices;
