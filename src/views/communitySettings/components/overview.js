import * as React from 'react';
import { SectionsContainer, Column } from '../style';
import { CommunityEditForm } from '../../../components/editForm';
import RecurringPaymentsList from './recurringPaymentsList';
import ChannelList from './channelList';
import ImportSlack from './importSlack';
import EmailInvites from './emailInvites';
import Invoices from './invoices';
import CommunityMembers from '../../../components/communityMembers';

class Overview extends React.Component<Props> {
  render() {
    const { community, communitySlug } = this.props;

    return (
      <SectionsContainer>
        <Column>
          <CommunityEditForm community={community} />
          <RecurringPaymentsList community={community} />
        </Column>
        <Column>
          <ImportSlack community={community} id={community.id} />
          <EmailInvites community={community} />
          <ChannelList communitySlug={communitySlug} />
          <CommunityMembers id={community.id} />
          <Invoices id={community.id} />
        </Column>
      </SectionsContainer>
    );
  }
}

export default Overview;
