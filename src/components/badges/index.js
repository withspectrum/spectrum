// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { Span, ProBadge, BlockedBadge, PendingBadge, TeamBadge } from './style';
import { withCurrentUser } from 'src/components/withCurrentUser';

type Props = {
  type: string,
  label?: string,
  onClick?: Function,
  tipText: string,
  currentUser: ?Object,
  dispatch: Dispatch<Object>,
};

class Badge extends React.Component<Props> {
  render() {
    const { type, label, ...rest } = this.props;
    switch (type) {
      case 'beta-supporter':
        return (
          <ProBadge
            type={type}
            tipText={'Beta Supporter'}
            tipLocation={'top'}
            {...rest}
          >
            {label || 'Supporter'}
          </ProBadge>
        );
      case 'blocked':
        return (
          <BlockedBadge
            type={type}
            tipText={this.props.tipText}
            tipLocation={'top-left'}
            {...rest}
          >
            {label || type}
          </BlockedBadge>
        );
      case 'pending':
        return (
          <PendingBadge
            type={type}
            tipText={this.props.tipText}
            tipLocation={'top-left'}
            {...rest}
          >
            {label || type}
          </PendingBadge>
        );
      case 'moderator':
      case 'admin':
        return (
          <TeamBadge
            type={type}
            tipText={`${
              type === 'moderator' ? 'Moderator' : 'Owner'
            } of this community`}
            tipLocation="top-left"
            {...rest}
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
            {...rest}
          >
            {label || type}
          </Span>
        );
    }
  }
}

export default compose(
  withCurrentUser,
  connect()
)(Badge);
