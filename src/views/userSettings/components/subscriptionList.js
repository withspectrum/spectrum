//@flow
import React from 'react';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import compose from 'recompose/compose';
import { ListCardItem } from '../../../components/listCard';
import { IconButton } from '../../../components/buttons';
import { openModal } from '../../../actions/modals';
import { convertTimestampToDate } from '../../../helpers/utils';
import { getCurrentUserSubscriptions } from '../../../api/user';
import { displayLoadingCard } from '../../../components/loading';
import {
  StyledCard,
  LargeListHeading,
  ListHeader,
  ListContainer,
} from '../../../components/listCard/style';

const SubscriptionList = ({ data: { user }, currentUser, dispatch }) => {
  const openProModal = () => {
    dispatch(openModal('UPGRADE_MODAL', { user: currentUser }));
  };

  // make sure to only display active subs for now
  const filteredSubs =
    user.subscriptions &&
    user.subscriptions.length > 0 &&
    user.subscriptions.filter(sub => sub.status === 'active');

  return (
    <StyledCard>
      <ListHeader>
        <LargeListHeading>Billing</LargeListHeading>
      </ListHeader>
      <ListContainer>
        {filteredSubs.length === 0 &&
          <ListCardItem
            contents={{ name: 'Upgrade to Pro' }}
            withDescription={false}
            meta={'sub'}
          >
            <IconButton glyph="settings" onClick={openProModal} />
          </ListCardItem>}
        {filteredSubs.length > 0 &&
          filteredSubs.map(subscription => {
            const amount = subscription.amount / 100;
            const timestamp = new Date(subscription.created * 1000).getTime();
            const created = convertTimestampToDate(timestamp);
            const meta = `$${amount}/month · Upgraded on ${created}`;
            return (
              <ListCardItem
                key={subscription.created}
                contents={{ name: subscription.plan }}
                withDescription={false}
                meta={meta}
              >
                <IconButton glyph="settings" onClick={openProModal} />
              </ListCardItem>
            );
          })}
      </ListContainer>
    </StyledCard>
  );
};

export default compose(
  getCurrentUserSubscriptions,
  displayLoadingCard,
  connect()
)(SubscriptionList);
