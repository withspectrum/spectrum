// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { getCurrentUser } from 'shared/graphql/queries/user/getUser';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';
import editUserMutation from 'shared/graphql/mutations/user/editUser';
import { saveUserDataToLocalStorage } from '../../actions/authentication';
import { removeItemFromStorage } from '../../helpers/localStorage';
import NewUserOnboarding from '../../views/newUserOnboarding';
import type { Dispatch } from 'redux';

type Props = {
  currentUser?: Object,
  dispatch: Dispatch<Object>,
  match: Object,
  history: Object,
  editUser: Function,
  data: {
    user: GetUserType,
  },
};

type State = {
  showNewUserOnboarding: boolean,
};

class AuthViewHandler extends React.Component<Props, State> {
  state = {
    showNewUserOnboarding: false,
  };

  setNewUserOnboarding = val => {
    return this.setState({
      showNewUserOnboarding: val,
    });
  };

  componentDidUpdate(prev) {
    const { data: { user }, editUser, dispatch, history, match } = this.props;
    // if no user was found, escape

    if (!user) {
      // clear localstorage first
      return removeItemFromStorage('spectrum');
    }

    if (prev.data.user !== user && user !== null) {
      // user has no timezone set
      if (!user.timezone) {
        editUser({ timezone: new Date().getTimezoneOffset() * -1 });
      }

      // save the user data to localstorage
      dispatch(saveUserDataToLocalStorage(user));

      // if the user doesn't have a username, show the onboarding
      if (!user.username) {
        this.setNewUserOnboarding(true);
      }

      // if the user lands on /home, it means they just logged in. If this code
      // runs, we know a user was returned successfully and set to localStorage,
      // so we can redirect to the root url
      if (match.url === '/home') {
        history.push('/');
      }
    }
  }

  render() {
    const { currentUser } = this.props;
    const { showNewUserOnboarding } = this.state;

    if (showNewUserOnboarding)
      return (
        <NewUserOnboarding
          close={() => this.setNewUserOnboarding(false)}
          currentUser={currentUser}
          noCloseButton
        />
      );

    return null;
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(
  // $FlowIssue
  connect(map),
  getCurrentUser,
  editUserMutation
)(AuthViewHandler);
