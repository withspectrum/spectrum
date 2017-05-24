//@flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import { UserEditForm } from '../../components/editForm';
import { GetCurrentUserProfile, GetCurrentUserThreads } from './queries';

const UserSettings = props => {
  const {
    data: { loading, error, username, profilePhoto, name },
    data,
  } = props;
  return (
    <AppViewWrapper>
      <Column type="secondary">

        <UserEditForm user={data} />
      </Column>

      <Column type="primary" />
    </AppViewWrapper>
  );
};

export default compose(GetCurrentUserProfile, pure)(UserSettings);
