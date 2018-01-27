// @flow
import * as React from 'react';
import EditForm from './editForm';
import RecurringPaymentsList from './recurringPaymentsList';
import ChannelList from './channelList';
import ImportSlack from './importSlack';
import { CommunityInvitationForm } from '../../../components/emailInvitationForm';
import Invoices from './invoices';
import CommunityMembers from './communityMembers';
import {
  SectionCard,
  SectionTitle,
  SectionsContainer,
  Column,
} from '../../../components/settingsViews/style';

type Props = {
  communitySlug: string,
  community: Object,
};
class Overview extends React.Component<Props> {
  render() {
    const { community, communitySlug } = this.props;

    return (
      <SectionsContainer>
        <Column>
          <EditForm community={community} />
          <RecurringPaymentsList community={community} id={community.id} />
          <Invoices id={community.id} />
        </Column>
        <Column>
          <ImportSlack community={community} id={community.id} />

          <SectionCard>
            <SectionTitle>Invite by email</SectionTitle>
            <CommunityInvitationForm id={community.id} />
          </SectionCard>

          <ChannelList id={community.id} communitySlug={communitySlug} />
        </Column>
        <Column>
          <CommunityMembers id={community.id} />
        </Column>
      </SectionsContainer>
    );
  }
}

export default Overview;
