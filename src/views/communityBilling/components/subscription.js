// @flow
import * as React from 'react';
import type { GetCommunitySettingsType } from 'shared/graphql/queries/community/getCommunitySettings';
import type { SubscriptionType } from 'shared/graphql/fragments/community/communitySettings';
import Link from '../../../components/link';
import {
  LineItem,
  LineItemLeft,
  LineItemRight,
  LineItemTotal,
  LineItemTitle,
  LineItemDescription,
  LineItemTitleTotal,
  LineItemPrice,
} from '../style';

type Props = {
  subscription: SubscriptionType,
  community: GetCommunitySettingsType,
};
type LineItemType = {
  id: string,
  created: Date,
  planId: string,
  planName: string,
  amount: number,
  quantity: number,
};

class Subscription extends React.Component<Props> {
  formatAmount = (amount: number): string =>
    (amount / 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

  totalLineItem = () => {
    const { subscription } = this.props;
    const subtotal = subscription.items.reduce(
      (sum, item) => item && (sum += item.amount * item.quantity),
      0
    );
    const periodEnd = new Date(subscription.current_period_end * 1000);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    if (!subscription.discount) {
      return (
        <LineItemTotal key={subscription.id}>
          <LineItemLeft>
            <LineItemTitleTotal>Estimated Total</LineItemTitleTotal>
            <LineItemDescription>
              Your next invoice will be on {months[periodEnd.getMonth()]}{' '}
              {periodEnd.getDate()}, {periodEnd.getFullYear()}
            </LineItemDescription>
          </LineItemLeft>
          <LineItemRight>
            <LineItemTitleTotal>
              ${subtotal && subtotal > 0 ? this.formatAmount(subtotal) : 0}
            </LineItemTitleTotal>
          </LineItemRight>
        </LineItemTotal>
      );
    }

    const calcTotal = subtotal => {
      if (!subtotal || subtotal === 0) return 0;

      if (subscription.discount && subscription.discount.amount_off) {
        return subtotal - subscription.discount.amount_off;
      }

      if (subscription.discount && subscription.discount.percent_off) {
        return subtotal - subtotal * (subscription.discount.percent_off / 100);
      }

      return subtotal;
    };

    const total = calcTotal(subtotal);
    const discountString =
      subscription.discount && subscription.discount.amount_off
        ? `-$${subscription.discount.amount_off}`
        : subscription.discount && subscription.discount.percent_off
          ? `-${subscription.discount.percent_off}%`
          : null;

    return (
      <LineItemTotal key={subscription.id}>
        <LineItemLeft>
          <LineItemDescription>Subtotal</LineItemDescription>
          <LineItemDescription>
            Discount · {subscription.discount && subscription.discount.id}
          </LineItemDescription>
          <LineItemTitleTotal>Estimated Total</LineItemTitleTotal>
          <LineItemDescription>
            Your next invoice will be on {months[periodEnd.getMonth()]}{' '}
            {periodEnd.getDate()},
            {periodEnd.getFullYear()}
          </LineItemDescription>
        </LineItemLeft>
        <LineItemRight>
          <LineItemDescription>
            ${subtotal && subtotal > 0 ? this.formatAmount(subtotal) : 0}
          </LineItemDescription>
          <LineItemDescription>{discountString}</LineItemDescription>
          <LineItemTitleTotal>${this.formatAmount(total)}</LineItemTitleTotal>
        </LineItemRight>
      </LineItemTotal>
    );
  };

  communityAnalytics = (lineItem: LineItemType) => (
    <LineItem key={lineItem.id}>
      <LineItemLeft>
        <LineItemTitle>Community analytics</LineItemTitle>
      </LineItemLeft>
      <LineItemRight>
        <LineItemPrice>${this.formatAmount(lineItem.amount)}</LineItemPrice>
      </LineItemRight>
    </LineItem>
  );

  prioritySupport = (lineItem: LineItemType) => (
    <LineItem key={lineItem.id}>
      <LineItemLeft>
        <LineItemTitle>Priority support</LineItemTitle>
      </LineItemLeft>
      <LineItemRight>
        <LineItemPrice>${this.formatAmount(lineItem.amount)}</LineItemPrice>
      </LineItemRight>
    </LineItem>
  );

  moderatorSeat = (lineItem: LineItemType) => (
    <LineItem key={lineItem.id}>
      <LineItemLeft>
        <LineItemTitle>Moderator seat</LineItemTitle>
        <LineItemDescription>Quantity: {lineItem.quantity}</LineItemDescription>
        <LineItemDescription>
          You can manage moderator seats in members settings
        </LineItemDescription>
      </LineItemLeft>
      <LineItemRight>
        <LineItemPrice>
          ${this.formatAmount(lineItem.amount * lineItem.quantity)}
        </LineItemPrice>
      </LineItemRight>
    </LineItem>
  );

  privateChannel = (lineItem: LineItemType) => (
    <LineItem key={lineItem.id}>
      <LineItemLeft>
        <LineItemTitle>Private channel</LineItemTitle>
        <LineItemDescription>Quantity: {lineItem.quantity}</LineItemDescription>
        <LineItemDescription>
          You can archive private channels individually by visiting the channel
          settings.
        </LineItemDescription>
      </LineItemLeft>
      <LineItemRight>
        <LineItemPrice>
          ${this.formatAmount(lineItem.amount * lineItem.quantity)}
        </LineItemPrice>
      </LineItemRight>
    </LineItem>
  );

  parseLineItem = (lineItem: LineItemType) => {
    switch (lineItem.planId) {
      case 'community-analytics':
        return this.communityAnalytics(lineItem);
      case 'priority-support':
        return this.prioritySupport(lineItem);
      case 'moderator-seat':
        return this.moderatorSeat(lineItem);
      case 'private-channel':
        return this.privateChannel(lineItem);
    }
  };

  render() {
    const { subscription } = this.props;

    return (
      <div>
        {subscription.items.map(item => item && this.parseLineItem(item))}
        {this.totalLineItem()}
        <LineItemDescription style={{ marginTop: '16px' }}>
          Spectrum automatically adjusts each month’s total invoice by only
          measuring what features you used, and for how long. As a result, your
          statements may show a total bill amount higher or lower than the
          estimate above.
          <Link to={'/pricing'}>
            Learn more about our Fair Billing Standard
          </Link>
        </LineItemDescription>
      </div>
    );
  }
}

export default Subscription;
