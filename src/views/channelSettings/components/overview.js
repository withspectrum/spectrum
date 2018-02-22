// @flow
import * as React from 'react';
import {
  SectionsContainer,
  Column,
} from '../../../components/settingsViews/style';
import EditForm from './editForm';
import PendingUsers from './pendingUsers';
import BlockedUsers from './blockedUsers';
import ChannelMembers from './channelMembers';
import ArchiveForm from './archiveForm';
// import { ChannelInvitationForm } from '../../../components/emailInvitationForm';

type Props = {
  community: Object,
  channel: Object,
  communitySlug: string,
  togglePending: Function,
  unblock: Function,
};
class Overview extends React.Component<Props> {
  render() {
    const { channel } = this.props;

    return (
      <SectionsContainer>
        <Column>
          <EditForm channel={channel} />
          <ArchiveForm channel={channel} />
        </Column>

        {/*channel.isPrivate && (
          // <Column>
          //   <SectionCard>
          //     <SectionTitle>Invite by email</SectionTitle>
          //     <ChannelInvitationForm community={community} />
          //   </SectionCard>
          // </Column>
        )*/}

        <Column>
          {channel.isPrivate && (
            <span>
              <ChannelMembers channel={channel} id={channel.id} />
              <PendingUsers
                togglePending={this.props.togglePending}
                channel={channel}
                id={channel.id}
              />
              <BlockedUsers
                unblock={this.props.unblock}
                channel={channel}
                id={channel.id}
              />
            </span>
          )}
          {!channel.isPrivate && <ChannelMembers id={channel.id} />}
        </Column>
      </SectionsContainer>
    );
  }
}

export default Overview;
