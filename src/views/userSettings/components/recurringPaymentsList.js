// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { BillingListItem } from 'src/components/listItems';
import { IconButton } from 'src/components/buttons';
import { UpsellUpgradeToPro } from 'src/components/upsell';
import { openModal } from 'src/actions/modals';
import { convertTimestampToDate } from 'src/helpers/utils';
import getCurrentUserRecurringPayments from 'shared/graphql/queries/user/getCurrentUserRecurringPayments';
import type { GetCurrentUserRecurringPaymentsType } from 'shared/graphql/queries/user/getCurrentUserRecurringPayments';
import { displayLoadingCard } from 'src/components/loading';
import { ListContainer } from 'src/components/listItems/style';
import { SectionCard, SectionTitle } from 'src/components/settingsViews/style';

type Props = {
  dispatch: Function,
  currentUser: Object,
  data: {
    user: GetCurrentUserRecurringPaymentsType,
  },
};

class RecurringPaymentsList extends React.Component<Props> {
  openProModal = () => {
    this.props.dispatch(
      openModal('UPGRADE_MODAL', { user: this.props.currentUser })
    );
  };

  render() {
    const { data: { user } } = this.props;
    if (!user || user === undefined) return null;

    // make sure to only display active subs for now
    const filteredRecurringPayments =
      user.recurringPayments && user.recurringPayments.length > 0
        ? user.recurringPayments.filter(sub => sub && sub.status === 'active')
        : [];

    if (filteredRecurringPayments.length > 0) {
      return (
        <SectionCard>
          <SectionTitle>Pro</SectionTitle>
          <ListContainer>
            {filteredRecurringPayments.map(payment => {
              if (!payment) return null;

              const amount = payment.amount / 100;
              const timestamp = new Date(payment.createdAt * 1000).getTime();
              const created = convertTimestampToDate(timestamp);
              const meta = `$${amount}/month · Upgraded on ${created}`;
              return (
                <BillingListItem
                  key={payment.createdAt}
                  contents={{ name: payment.plan }}
                  withDescription={false}
                  meta={meta}
                >
                  <IconButton glyph="settings" onClick={this.openProModal} />
                </BillingListItem>
              );
            })}
          </ListContainer>
        </SectionCard>
      );
    } else {
      return <UpsellUpgradeToPro />;
    }
  }
}

export default compose(
  getCurrentUserRecurringPayments,
  displayLoadingCard,
  connect()
)(RecurringPaymentsList);
