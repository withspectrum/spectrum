// @flow
import * as React from 'react';
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

class Subscription extends React.Component<{}> {
  formatAmount = amount =>
    (amount / 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

  totalLineItem = () => {
    const { subscription } = this.props;
    const subtotal = subscription.items.reduce(
      (sum, item) => (sum += item.amount * item.quantity),
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
            <LineItemTitleTotal>Total</LineItemTitleTotal>
            <LineItemDescription>
              Your next invoice will be on {months[periodEnd.getMonth()]}{' '}
              {periodEnd.getDay()}, {periodEnd.getFullYear()}
            </LineItemDescription>
          </LineItemLeft>
          <LineItemRight>
            <LineItemTitleTotal>
              ${this.formatAmount(subtotal)}
            </LineItemTitleTotal>
          </LineItemRight>
        </LineItemTotal>
      );
    }

    const calcTotal = subtotal => {
      if (subscription.discount.amount_off) {
        return subtotal - subscription.discount.amount_off;
      }

      if (subscription.discount.percent_off) {
        return subtotal - subtotal * (subscription.discount.percent_off / 100);
      }

      return subtotal;
    };

    const total = calcTotal(subtotal);
    const discountString = subscription.discount.amount_off
      ? `-$${subscription.discount.amount_off}`
      : `-${subscription.discount.percent_off}%`;

    return (
      <LineItemTotal key={subscription.id}>
        <LineItemLeft>
          <LineItemDescription>Subtotal</LineItemDescription>
          <LineItemDescription>
            Discount · {subscription.discount.id}
          </LineItemDescription>
          <LineItemTitleTotal>Total</LineItemTitleTotal>
          <LineItemDescription>
            Your next invoice will be on `${periodEnd.getMonth()} ${periodEnd.getDay()},
            ${periodEnd.getFullYear()}`
          </LineItemDescription>
        </LineItemLeft>
        <LineItemRight>
          <LineItemDescription>
            ${this.formatAmount(subtotal)}
          </LineItemDescription>
          <LineItemDescription>{discountString}</LineItemDescription>
          <LineItemTitleTotal>${this.formatAmount(total)}</LineItemTitleTotal>
        </LineItemRight>
      </LineItemTotal>
    );
  };

  communityAnalytics = lineItem => (
    <LineItem key={lineItem.id}>
      <LineItemLeft>
        <LineItemTitle>Community analytics</LineItemTitle>
      </LineItemLeft>
      <LineItemRight>
        <LineItemPrice>${this.formatAmount(lineItem.amount)}</LineItemPrice>
      </LineItemRight>
    </LineItem>
  );

  prioritySupport = lineItem => (
    <LineItem key={lineItem.id}>
      <LineItemLeft>
        <LineItemTitle>Priority support</LineItemTitle>
      </LineItemLeft>
      <LineItemRight>
        <LineItemPrice>${this.formatAmount(lineItem.amount)}</LineItemPrice>
      </LineItemRight>
    </LineItem>
  );

  moderatorSeat = lineItem => (
    <LineItem key={lineItem.id}>
      <LineItemLeft>
        <LineItemTitle>Moderator seat</LineItemTitle>
        <LineItemDescription>Quantity: {lineItem.quantity}</LineItemDescription>
        <LineItemDescription>
          You can manage moderator in members settings
        </LineItemDescription>
      </LineItemLeft>
      <LineItemRight>
        <LineItemPrice>
          ${this.formatAmount(lineItem.amount * lineItem.quantity)}
        </LineItemPrice>
      </LineItemRight>
    </LineItem>
  );

  privateChannel = lineItem => (
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

  parseLineItem = lineItem => {
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
        {subscription.items.map(item => this.parseLineItem(item))}
        {this.totalLineItem()}
      </div>
    );
  }
}

export default Subscription;
