// @flow
import * as React from 'react';
import type { GetCurrentUserSettingsType } from 'shared/graphql/queries/user/getCurrentUserSettings';
import UserEditForm from './editForm';
import NotificationSettings from './notificationSettings';
import WebPushSettings from './webPushSettings';
import Invoices from './invoices';
import DeleteAccountForm from './deleteAccountForm';
import DownloadDataForm from './downloadDataForm';
import RecurringPaymentsList from './recurringPaymentsList';
import { SectionsContainer, Column } from 'src/components/settingsViews/style';

type Props = {
  user: GetCurrentUserSettingsType,
};

class Overview extends React.Component<Props> {
  render() {
    const { user } = this.props;

    return (
      <SectionsContainer>
        <Column>
          <UserEditForm user={user} />
          <DeleteAccountForm id={user.id} />
          <DownloadDataForm user={user} />
        </Column>
        <Column>
          <RecurringPaymentsList user={user} />
          <NotificationSettings user={user} />
          <Invoices />
        </Column>
      </SectionsContainer>
    );
  }
}

export default Overview;
