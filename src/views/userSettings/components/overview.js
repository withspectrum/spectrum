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
import { SentryErrorBoundary, SettingsFallback } from 'src/components/error';

type Props = {
  user: GetCurrentUserSettingsType,
};

class Overview extends React.Component<Props> {
  render() {
    const { user } = this.props;

    return (
      <SectionsContainer>
        <Column>
          <SentryErrorBoundary fallbackComponent={SettingsFallback}>
            <UserEditForm user={user} />
          </SentryErrorBoundary>

          <SentryErrorBoundary fallbackComponent={SettingsFallback}>
            <DeleteAccountForm id={user.id} />
          </SentryErrorBoundary>

          <SentryErrorBoundary fallbackComponent={SettingsFallback}>
            <DownloadDataForm user={user} />
          </SentryErrorBoundary>
        </Column>
        <Column>
          <SentryErrorBoundary fallbackComponent={SettingsFallback}>
            <RecurringPaymentsList user={user} />
          </SentryErrorBoundary>

          <SentryErrorBoundary fallbackComponent={SettingsFallback}>
            <EmailSettings user={user} />
          </SentryErrorBoundary>

          <SentryErrorBoundary fallbackComponent={SettingsFallback}>
            {'serviceWorker' in navigator &&
              'PushManager' in window && <NotificationSettings largeOnly />}
          </SentryErrorBoundary>

          <SentryErrorBoundary fallbackComponent={SettingsFallback}>
            <Invoices />
          </SentryErrorBoundary>
        </Column>
      </SectionsContainer>
    );
  }
}

export default Overview;
