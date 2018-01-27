// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { BillingListItem } from '../../../components/listItems';
import { IconButton } from '../../../components/buttons';
import { UpsellUpgradeToPro } from '../../../components/upsell';
import { openModal } from '../../../actions/modals';
import { convertTimestampToDate } from '../../../helpers/utils';
import getCurrentUserRecurringPayments from 'shared/graphql/queries/user/getCurrentUserRecurringPayments';
import type { GetCurrentUserRecurringPaymentsType } from 'shared/graphql/queries/user/getCurrentUserRecurringPayments';
import { displayLoadingCard } from '../../../components/loading';
import {
  StyledCard,
  LargeListHeading,
  ListHeader,
  ListContainer,
} from '../../../components/listItems/style';

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
        <StyledCard>
          <ListHeader>
            <LargeListHeading>Pro</LargeListHeading>
          </ListHeader>
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
        </StyledCard>
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
