//@flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import pure from 'recompose/pure';
import { track } from '../../helpers/events';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import { displayLoadingState } from '../../components/loading';
import { UserEditForm } from '../../components/editForm';
import { Upsell404User } from '../../components/upsell';
import RecurringPaymentsList from './components/recurringPaymentsList';
import EmailSettings from './components/emailSettings';
import NotificationSettings from './components/notificationSettings';
import { GetUserProfile } from './queries';
import { FlexCol } from '../../components/globals';
import Titlebar from '../titlebar';

const UserSettings = ({ data, currentUser, match }) => {
  track('user', 'settings viewed', null);

  if (!data.user) {
    return (
      <FlexCol style={{ flex: 'auto' }}>
        <Titlebar
          title={`No User Found`}
          provideBack={true}
          backRoute={`/`}
          noComposer
        />
        <AppViewWrapper>
          <Column type="primary">
            <Upsell404User username={match.params.username} />
          </Column>
        </AppViewWrapper>
      </FlexCol>
    );
  }

  if (!currentUser || data.user.id !== currentUser.id) {
    return (
      <FlexCol style={{ flex: 'auto' }}>
        <Titlebar
          title={`No Permission`}
          provideBack={true}
          backRoute={`/`}
          noComposer
        />
        <AppViewWrapper>
          <Column type="primary">
            <Upsell404User username={match.params.username} noPermission />
          </Column>
        </AppViewWrapper>
      </FlexCol>
    );
  }

  return (
    <FlexCol style={{ flex: 'auto' }}>
      <Titlebar
        title={data.user.name}
        subtitle={'Settings'}
        provideBack={true}
        backRoute={`/${data.user.username}`}
        noComposer
      />
      <AppViewWrapper>
        <Column type="secondary">
          <UserEditForm user={data} />
          <EmailSettings smallOnly currentUser={data.user} />
        </Column>

        <Column type="primary">
          <RecurringPaymentsList data={data} currentUser={data.user} />
          <EmailSettings largeOnly currentUser={data.user} />
          {'serviceWorker' in navigator &&
            'PushManager' in window &&
            <NotificationSettings largeOnly />}
        </Column>
      </AppViewWrapper>
    </FlexCol>
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
