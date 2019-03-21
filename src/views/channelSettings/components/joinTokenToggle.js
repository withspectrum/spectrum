// @flow
import * as React from 'react';
import { Checkbox } from 'src/components/formElements';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import enableTokenJoinMutation from 'shared/graphql/mutations/channel/enableChannelTokenJoin';
import disableTokenJoinMutation from 'shared/graphql/mutations/channel/disableChannelTokenJoin';
import { addToastWithTimeout } from 'src/actions/toasts';
import type { Dispatch } from 'redux';

type Props = {
  id: string,
  settings: {
    tokenJoinEnabled: boolean,
  },
  enableChannelTokenJoin: Function,
  disableChannelTokenJoin: Function,
  dispatch: Dispatch<Object>,
};

class TokenJoinToggle extends React.Component<Props> {
  init = () => {
    return this.props.settings.tokenJoinEnabled
      ? this.disable()
      : this.enable();
  };

  disable = () => {
    return this.props
      .disableChannelTokenJoin({ id: this.props.id })
      .then(() => {
        return this.props.dispatch(
          addToastWithTimeout('neutral', 'Link disabled')
        );
      })
      .catch(err => {
        return this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  enable = () => {
    return this.props
      .enableChannelTokenJoin({ id: this.props.id })
      .then(() => {
        return this.props.dispatch(
          addToastWithTimeout('success', 'Link enabled')
        );
      })
      .catch(err => {
        return this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { tokenJoinEnabled } = this.props.settings;

    return (
      <Checkbox
        checked={tokenJoinEnabled}
        onChange={this.init}
        dataCy="toggle-token-link-invites"
      >
        Enable users to join via link
      </Checkbox>
    );
  }
}

export default compose(
  connect(),
  enableTokenJoinMutation,
  disableTokenJoinMutation
)(TokenJoinToggle);
