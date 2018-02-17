// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { openModal } from '../../actions/modals';
import { Span, ProBadge, BlockedBadge } from './style';

type Props = {
  type: string,
  onClick?: Function,
  tipText: string,
  currentUser: ?Object,
  dispatch: Function,
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
    switch (this.props.type) {
      case 'pro':
        return (
          <ProBadge
            type={this.props.type}
            tipText={this.props.tipText}
            tipLocation={'top-left'}
            onClick={this.triggerProModal}
          >
            {this.props.type}
          </ProBadge>
        );
      case 'blocked':
        return (
          <BlockedBadge
            type={this.props.type}
            tipText={this.props.tipText}
            tipLocation={'top-left'}
          >
            {this.props.type}
          </BlockedBadge>
        );
      default:
        return (
          <Span
            type={this.props.type}
            tipText={this.props.tipText}
            tipLocation={'top-left'}
            onClick={this.props.onClick && this.props.onClick}
          >
            {this.props.type}
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
