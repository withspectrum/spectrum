//@flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import pure from 'recompose/pure';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import { displayLoadingState } from '../../components/loading';
import { UserEditForm } from '../../components/editForm';
import { Upsell404User } from '../../components/upsell';
import RecurringPaymentsList from './components/recurringPaymentsList';
import { GetUserProfile } from './queries';
import Titlebar from '../titlebar';

const UserSettings = ({ data, currentUser, match }) => {
  if (!data.user) {
    return (
      <AppViewWrapper>
        <Titlebar title={`No User Found`} provideBack={true} backRoute={`/`} />
        <Column type="primary">
          <Upsell404User username={match.params.username} />
        </Column>
      </AppViewWrapper>
    );
  }

  if (data.user.id !== currentUser.id) {
    return (
      <AppViewWrapper>
        <Titlebar title={`No Permission`} provideBack={true} backRoute={`/`} />
        <Column type="primary">
          <Upsell404User username={match.params.username} noPermission />
        </Column>
      </AppViewWrapper>
    );
  }

  return (
    <AppViewWrapper>
      <Titlebar
        title={data.user.name}
        subtitle={'Settings'}
        provideBack={true}
        backRoute={`/${data.user.username}`}
      />
      <Titlebar title={data.user.name} subtitle={'Settings'} />
      <Column type="secondary">
        <UserEditForm user={data} />
      </Column>

      <Column type="primary">
        <RecurringPaymentsList data={data} currentUser={data.user} />
      </Column>
    </AppViewWrapper>
  );
};

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

export default compose(
  GetUserProfile,
  displayLoadingState,
  connect(mapStateToProps),
  pure
)(UserSettings);
