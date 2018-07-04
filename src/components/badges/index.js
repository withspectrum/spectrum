// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { openModal } from '../../actions/modals';
import type { Dispatch } from 'redux';
import {
  Span,
  ProBadge,
  BlockedBadge,
  PendingBadge,
  DefaultPaymentMethodBadge,
  TeamBadge,
} from './style';

type Props = {
  type: string,
  onClick?: Function,
  tipText: string,
  currentUser: ?Object,
  dispatch: Dispatch<Object>,
};

class Badge extends React.Component<Props> {
  triggerProModal = () => {
    // if user isn't signed in, don't trigger the modal
    // if the user is currently pro, don't trigger the modal (otherwise they'll see a downsell)
    if (!this.props.currentUser || this.props.currentUser.isPro) return;
    // otherwise trigger the upgrade modal
    this.props.dispatch(
      openModal('UPGRADE_MODAL', { user: this.props.currentUser })
    );
  };

  render() {
    const { type } = this.props;
    switch (type) {
      case 'default-payment-method':
        return (
          <DefaultPaymentMethodBadge
            type={type}
            tipText={this.props.tipText}
            tipLocation={'top-left'}
            onClick={this.triggerProModal}
          >
            Default
          </DefaultPaymentMethodBadge>
        );
      case 'pro':
        return (
          <ProBadge
            type={type}
            tipText={this.props.tipText}
            tipLocation={'top-left'}
            onClick={this.triggerProModal}
          >
            {type}
          </ProBadge>
        );
      case 'blocked':
        return (
          <BlockedBadge
            type={type}
            tipText={this.props.tipText}
            tipLocation={'top-left'}
          >
            {type}
          </BlockedBadge>
        );
      case 'pending':
        return (
          <PendingBadge
            type={type}
            tipText={this.props.tipText}
            tipLocation={'top-left'}
          >
            {type}
          </PendingBadge>
        );
      case 'moderator':
      case 'admin':
        return (
          <TeamBadge
            type={type}
            tipText={this.props.tipText}
            tipLocation="top-left"
          >
            Team
          </TeamBadge>
        );
      default:
        return (
          <Span
            type={type}
            tipText={this.props.tipText}
            tipLocation={'top-left'}
            onClick={this.props.onClick && this.props.onClick}
          >
            {type}
          </Span>
        );
    }
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
});

export default compose(
  // $FlowIssue
  connect(map)
)(Badge);
