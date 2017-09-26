//@flow
import * as React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import pure from 'recompose/pure';
import { track } from '../../helpers/events';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import { Loading } from '../../components/loading';
import { UserEditForm } from '../../components/editForm';
import RecurringPaymentsList from './components/recurringPaymentsList';
import EmailSettings from './components/emailSettings';
import NotificationSettings from './components/notificationSettings';
import Invoices from './components/invoices';
import { GetUserProfile } from './queries';
import { FlexCol } from '../../components/globals';
import ViewError from '../../components/viewError';
import Titlebar from '../titlebar';
import viewNetworkHandler from '../../components/viewNetworkHandler';

type Props = {
  currentUser: Object,
  data: {
    user: Object,
  },
  isLoading: boolean,
  hasError: boolean,
};

class UserSettings extends React.Component<Props> {
  componentDidMount() {
    track('user', 'settings viewed', null);
  }

  render() {
    const { data: { user }, data, isLoading, currentUser } = this.props;

    if (isLoading) {
      return <Loading />;
    }

    // if the user has data in the store, but no user was returned from the query, we likely have a mismatch in their localstorage data and session cookie. In this case, when they hit the error view we'll automatically clear the user's localstorage so that on refresh they will be prompted to log in again
    if (currentUser && !user) {
      return (
        <FlexCol style={{ flex: 'auto' }}>
          <Titlebar
            title={`No User Found`}
            provideBack={true}
            backRoute={`/`}
            noComposer
          />
          <AppViewWrapper>
            <ViewError
              heading={'We ran into an error finding this user’s settings.'}
              subheading={
                'If you are trying to view your own settings, refresh the page below to log in again.'
              }
              clearStorage
              refresh
            />
          </AppViewWrapper>
        </FlexCol>
      );
    }

    // if no data was found but the user is logged in, it means the person was trying to view a user settings page for a user that doesn't exist in the db
    if (currentUser && !user) {
      return (
        <FlexCol style={{ flex: 'auto' }}>
          <Titlebar
            title={`User not found`}
            provideBack={true}
            backRoute={`/`}
            noComposer
          />
          <AppViewWrapper>
            <ViewError
              heading={'We couldn’t find a user with this username.'}
            />
          </AppViewWrapper>
        </FlexCol>
      );
    }

    // if the user isn't logged in, or for some reason the user settings that were returned don't match the user id in the store, we show a warning error state
    if (!currentUser || user.id !== currentUser.id) {
      return (
        <FlexCol style={{ flex: 'auto' }}>
          <Titlebar
            title={`No Permission`}
            provideBack={true}
            backRoute={`/`}
            noComposer
          />
          <AppViewWrapper>
            <ViewError
              heading={`These aren’t the settings you’re looking for.`}
              subheading={`You can only view your own user settings. Head on back.`}
            />
          </AppViewWrapper>
        </FlexCol>
      );
    }

    return (
      <FlexCol style={{ flex: 'auto' }}>
        <Titlebar
          title={user.name}
          subtitle={'Settings'}
          provideBack={true}
          backRoute={`/${user.username}`}
          noComposer
        />
        <AppViewWrapper>
          <Column type="secondary">
            <UserEditForm user={data} />
            <EmailSettings smallOnly currentUser={user} />
          </Column>

          <Column type="primary">
            <RecurringPaymentsList data={data} currentUser={user} />
            <EmailSettings largeOnly currentUser={user} />
            {'serviceWorker' in navigator &&
            'PushManager' in window && <NotificationSettings largeOnly />}
            <Invoices />
          </Column>
        </AppViewWrapper>
      </FlexCol>
    );
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
});

export default compose(connect(map), GetUserProfile, viewNetworkHandler, pure)(
  UserSettings
);
