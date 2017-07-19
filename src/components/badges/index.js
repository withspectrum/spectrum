// @flow
import React, { Component } from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import styled from 'styled-components';
// $FlowFixMe
import { connect } from 'react-redux';
import { Gradient, Tooltip } from '../globals';
import { openModal } from '../../actions/modals';

const Span = styled.span`
  color: ${({ theme }) => theme.text.reverse};
  background-color: ${props => props.theme.text.alt};
  background-image: 'none';
  text-transform: uppercase;
  padding: 2px 4px;
  margin-left: 4px;
  font-size: 9px;
  font-weight: 800;
  border-radius: 4px;
  ${props => (props.tipText ? Tooltip(props) : '')};
  align-self: center;
  line-height: 1.4;
`;

const ProBadge = styled(Span)`
  background-color: ${props => props.theme.success.alt};
  background-image: ${props =>
    Gradient(props.theme.space.light, props.theme.success.default)}
  cursor: pointer;

  &:hover {
    cursor: pointer;
  }
`;

class Badge extends Component {
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
      default:
        return (
          <Span
            type={this.props.type}
            tipText={this.props.tipText}
            tipLocation={'top-left'}
            onClick={this.props.onClick}
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
export default compose(connect(map), pure)(Badge);
