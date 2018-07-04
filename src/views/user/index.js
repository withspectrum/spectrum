// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import {
  getUserByMatch,
  getCurrentUser,
} from 'shared/graphql/queries/user/getUser';
import Container from './container';

type Props = {
  currentUser: ?Object,
};

const UserByMatch = compose(
  // $FlowIssue
  connect(map),
  getUserByMatch,
  viewNetworkHandler
)(Container);

const CurrentUser = compose(
  // $FlowIssue
  connect(map),
  getCurrentUser,
  viewNetworkHandler
)(Container);

class User extends React.Component<Props> {
  render() {
    const { currentUser } = this.props;

    if (currentUser && currentUser.id) {
      return <CurrentUser />;
    }

    return <UserByMatch />;
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(
  // $FlowIssue
  connect(map)
)(User);
