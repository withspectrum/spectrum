// @flow
import React from 'react';
import { withRouter } from 'react-router';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Idle from 'react-idle';

import updateUserStatusMutation from 'shared/graphql/mutations/user/updateUserStatus';

const IDLE_TIMEOUT_MINUTES = 3;
const BLURRED_TIMEOUT_MINUTES = 0.5;

type Props = {
  currentUser?: Object,
  updateStatus: Function,
};

type State = {
  isBlurred: boolean,
  isIdle: boolean,
};

class IdleManagerWithData extends React.Component<Props, State> {
  state = {
    isBlurred: false,
    isIdle: false,
  };

  updateStatus = (isIdle: boolean) => {
    if (this.state.isIdle === isIdle) return;

    this.setState({ isIdle }, () => {
      if (this.props.currentUser)
        this.props.updateStatus(isIdle ? 'idle' : 'online');
    });
  };

  handleWindowBlur = () => {
    this.setState({ isBlurred: true });
  };

  handleWindowFocus = () => {
    this.setState({ isBlurred: false });
    this.updateStatus(false);
  };

  componentDidMount() {
    window.addEventListener('blur', this.handleWindowBlur);
    window.addEventListener('focus', this.handleWindowFocus);
  }

  componentWillUnmount() {
    window.removeEventListener('blur', this.handleWindowBlur);
    window.removeEventListener('focus', this.handleWindowFocus);
  }

  render() {
    return (
      <Idle
        timeout={
          this.state.isBlurred
            ? BLURRED_TIMEOUT_MINUTES * 60000
            : IDLE_TIMEOUT_MINUTES * 60000
        }
        onChange={({ idle }) => this.updateStatus(idle)}
      />
    );
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
});

const IdleManager = compose(
  updateUserStatusMutation,
  withRouter,
  withApollo,
  // $FlowIssue
  connect(map)
)(IdleManagerWithData);

export default IdleManager;
