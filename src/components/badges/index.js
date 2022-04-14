// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { Span, ProBadge, BlockedBadge, PendingBadge, TeamBadge } from './style';
import { withCurrentUser } from 'src/components/withCurrentUser';
import Tooltip from 'src/components/tooltip';

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
          <Tooltip content={'Beta Supporter'}>
            <ProBadge type={type} {...rest}>
              {label || 'Supporter'}
            </ProBadge>
          </Tooltip>
        );
      case 'blocked':
        return (
          <Tooltip content={this.props.tipText}>
            <BlockedBadge type={type} {...rest}>
              {label || type}
            </BlockedBadge>
          </Tooltip>
        );
      case 'pending':
        return (
          <Tooltip content={this.props.tipText}>
            <PendingBadge type={type} {...rest}>
              {label || type}
            </PendingBadge>
          </Tooltip>
        );
      case 'moderator':
      case 'admin':
        return (
          <Tooltip
            content={`${
              type === 'moderator' ? 'Moderator' : 'Owner'
            } of this community`}
          >
            <TeamBadge type={type} {...rest}>
              Team
            </TeamBadge>
          </Tooltip>
        );
      default:
        return (
          <Tooltip content={this.props.tipText || label || ''}>
            <Span
              type={type}
              onClick={this.props.onClick && this.props.onClick}
              {...rest}
            >
              {label || type}
            </Span>
          </Tooltip>
        );
    }
  }
}

export default compose(
  withCurrentUser,
  connect()
)(Badge);
