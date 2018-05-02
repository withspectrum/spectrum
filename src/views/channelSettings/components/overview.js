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
import LoginTokenSettings from './loginTokenSettings';
import SlackConnection from '../../communitySettings/components/slack';

type Props = {
  community: Object,
  channel: Object,
  communitySlug: string,
  togglePending: Function,
  unblock: Function,
  initMessage: Function,
};
class Overview extends React.Component<Props> {
  render() {
    const { channel, initMessage, community } = this.props;

    return (
      <SectionsContainer data-cy="channel-overview">
        <Column>
          <EditForm channel={channel} />
          <SlackConnection
            type={'bot-only'}
            id={community.id}
            channelFilter={channel.id}
          />
          {channel.slug !== 'general' && <ArchiveForm channel={channel} />}
          {channel.isPrivate && (
            <LoginTokenSettings id={channel.id} channel={channel} />
          )}
        </Column>

        <Column>
          {channel.isPrivate && (
            <span>
              <ChannelMembers
                channel={channel}
                id={channel.id}
                initMessage={initMessage}
              />
              <PendingUsers
                togglePending={this.props.togglePending}
                channel={channel}
                id={channel.id}
                initMessage={initMessage}
              />
              <BlockedUsers
                unblock={this.props.unblock}
                channel={channel}
                id={channel.id}
                initMessage={initMessage}
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
