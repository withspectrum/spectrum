// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter, type History } from 'react-router-dom';
import { withCurrentUser } from 'src/components/withCurrentUser';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';
import { openModal } from 'src/actions/modals';

type Props = {
  render: Function,
  children: any,
  dispatch: Dispatch<Object>,
  currentUser: ?GetUserType,
  user: Object,
  history: History,
};

const InitDirectMessage = (props: Props) => {
  const { dispatch, currentUser, render, user, history } = props;

  const init = (e: any) => {
    e && e.preventDefault() && e.stopPropagation();

    if (!currentUser || !currentUser.id) {
      return dispatch(openModal('LOGIN_MODAL'));
    }

    dispatch(initNewThreadWithUser(user));
    history.push('/messages/new');
  };

  if (currentUser && currentUser.id === user.id) return null;

  return (
    <span style={{ display: 'flex' }} onClick={init}>
      {render}
    </span>
  );
};

export default compose(
  connect(),
  withCurrentUser,
  withRouter
)(InitDirectMessage);
