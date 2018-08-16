// @flow
import * as React from 'react';
import type { GetCurrentUserSettingsType } from 'shared/graphql/queries/user/getCurrentUserSettings';
import UserEditForm from './editForm';
import EmailSettings from './emailSettings';
import NotificationSettings from './notificationSettings';
import Invoices from './invoices';
import DeleteAccountForm from './deleteAccountForm';
import DownloadDataForm from './downloadDataForm';
import RecurringPaymentsList from './recurringPaymentsList';
import { SectionsContainer, Column } from 'src/components/settingsViews/style';
import { ErrorBoundary, SettingsFallback } from 'src/components/error';
import { isDesktopApp } from 'src/helpers/is-desktop-app';

type Props = {
  user: GetCurrentUserSettingsType,
};

class Overview extends React.Component<Props> {
  render() {
    const { user } = this.props;

    return (
      <SectionsContainer>
        <Column>
          <ErrorBoundary fallbackComponent={SettingsFallback}>
            <UserEditForm user={user} />
          </ErrorBoundary>

          <ErrorBoundary fallbackComponent={SettingsFallback}>
            <DeleteAccountForm id={user.id} />
          </ErrorBoundary>

          <ErrorBoundary fallbackComponent={SettingsFallback}>
            <DownloadDataForm user={user} />
          </ErrorBoundary>
        </Column>
        <Column>
          <ErrorBoundary fallbackComponent={SettingsFallback}>
            <RecurringPaymentsList user={user} />
          </ErrorBoundary>

          <ErrorBoundary fallbackComponent={SettingsFallback}>
            <EmailSettings user={user} />
          </ErrorBoundary>

          <ErrorBoundary fallbackComponent={SettingsFallback}>
            {!isDesktopApp() &&
              'serviceWorker' in navigator &&
              'PushManager' in window && <NotificationSettings largeOnly />}
          </ErrorBoundary>

          <ErrorBoundary fallbackComponent={SettingsFallback}>
            <Invoices />
          </ErrorBoundary>
        </Column>
      </SectionsContainer>
    );
  }
}

export default Overview;
