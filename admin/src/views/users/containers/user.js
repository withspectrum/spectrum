// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
import { getUserByUsername } from '../../../api/queries';
import { displayLoadingState } from '../../../components/loading';
import ProfileHeader from '../../../components/profileHeader';

class UserContainer extends Component {
  render() {
    const { data: { error, user } } = this.props;
    if (error || !user) {
      return <div />;
    }

    return <ProfileHeader user={user} />;
  }
}

export default compose(getUserByUsername, displayLoadingState, pure)(
  UserContainer
);
