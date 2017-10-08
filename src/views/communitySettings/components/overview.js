import * as React from 'react';
import { SectionsContainer, Column } from '../style';
import EditForm from './editForm';
import RecurringPaymentsList from './recurringPaymentsList';
import ChannelList from './channelList';
import ImportSlack from './importSlack';
import EmailInvites from './emailInvites';
import Invoices from './invoices';
import CommunityMembers from './communityMembers';

class Overview extends React.Component<Props> {
  render() {
    const { community, communitySlug } = this.props;

    return (
      <SectionsContainer>
        <Column>
          <EditForm community={community} />
          <RecurringPaymentsList community={community} />
          <Invoices id={community.id} />
        </Column>
        <Column>
          <ImportSlack community={community} id={community.id} />
          <EmailInvites community={community} />
          <ChannelList communitySlug={communitySlug} />
        </Column>
        <Column>
          <CommunityMembers id={community.id} />
        </Column>
      </SectionsContainer>
    );
  }
}

export default Overview;
