//@flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import { displayLoadingState } from '../../components/loading';
import { UserEditForm } from '../../components/editForm';

import { SubscriptionList } from './components/subscriptionList';
import { GetCurrentUserProfile, GetCurrentUserThreads } from './queries';

const UserSettings = props => {
  const { data } = props;
  return (
    <AppViewWrapper>
      <Column type="secondary">
        <UserEditForm user={data} />
        <SubscriptionList data={data} />
      </Column>

      <Column type="primary" />
    </AppViewWrapper>
  );
};

export default compose(GetCurrentUserProfile, displayLoadingState, pure)(
  UserSettings
);
