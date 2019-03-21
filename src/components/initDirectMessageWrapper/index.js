// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter, type History } from 'react-router-dom';
import { withCurrentUser } from 'src/components/withCurrentUser';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';

type Props = {
  render: Function,
  children: any,
  dispatch: Dispatch<Object>,
  currentUser: ?GetUserType,
  user: Object,
  history: History,
};

const InitDirectMessage = (props: Props) => {
  const { dispatch, history, currentUser, render, user } = props;

  const init = (e: any) => {
    e && e.preventDefault() && e.stopPropogation();
    dispatch(initNewThreadWithUser(user));
    history.push({
      pathname: currentUser ? `/new/message` : '/login',
      state: { modal: !!currentUser },
    });
  };

  if (currentUser && currentUser.id === user.id) return null;

  return (
    <span
      data-cy="message-user-button"
      style={{ display: 'flex', flex: '1 0 auto' }}
      onClick={init}
    >
      {render}
    </span>
  );
};

export default compose(
  connect(),
  withCurrentUser,
  withRouter
)(InitDirectMessage);
