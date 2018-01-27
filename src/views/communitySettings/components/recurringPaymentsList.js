// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { BillingListItem } from '../../../components/listItems';
import { IconButton } from '../../../components/buttons';
import { UpsellUpgradeCommunity } from './upgradeCommunity';
import { openModal } from '../../../actions/modals';
import { convertTimestampToDate } from '../../../helpers/utils';
import {
  SectionCard,
  SectionTitle,
} from '../../../components/settingsViews/style';
import { ListContainer } from '../../../components/listItems/style';
import type { GetCommunityRecurringPaymentsType } from 'shared/graphql/queries/community/getCommunityRecurringPayments';
import getCommunityRecurringPayments from 'shared/graphql/queries/community/getCommunityRecurringPayments';

type Props = {
  data: {
    community: GetCommunityRecurringPaymentsType,
  },
  currentUser: Object,
  dispatch: Function,
};

class RecurringPaymentsList extends React.Component<Props> {
  openCommunityProModal = () => {
    const { currentUser, data: { community } } = this.props;
    this.props.dispatch(
      openModal('COMMUNITY_UPGRADE_MODAL', { user: currentUser, community })
    );
  };

  render() {
    const { data: { community } } = this.props;

    if (!community || community === undefined) return null;

    // make sure to only display active subs for now
    const filteredRecurringPayments =
      community.recurringPayments && community.recurringPayments.length > 0
        ? community.recurringPayments.filter(
            subscription => subscription && subscription.status === 'active'
          )
        : [];

    if (filteredRecurringPayments.length > 0) {
      return (
        <SectionCard>
          <SectionTitle>Plan</SectionTitle>
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
                  <IconButton
                    glyph="settings"
                    onClick={this.openCommunityProModal}
                  />
                </BillingListItem>
              );
            })}
          </ListContainer>
        </SectionCard>
      );
    } else {
      return (
        <SectionCard>
          <UpsellUpgradeCommunity community={community} />
        </SectionCard>
      );
    }
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
});
export default compose(
  // $FlowIssue
  connect(map),
  getCommunityRecurringPayments
)(RecurringPaymentsList);
