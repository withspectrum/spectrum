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
import { SentryErrorBoundary, SettingsFallback } from 'src/components/error';

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
          <SentryErrorBoundary fallbackComponent={SettingsFallback}>
            <EditForm channel={channel} />
          </SentryErrorBoundary>

          <SentryErrorBoundary fallbackComponent={SettingsFallback}>
            <SlackConnection
              type={'bot-only'}
              id={community.id}
              channelFilter={channel.id}
            />
          </SentryErrorBoundary>

          <SentryErrorBoundary fallbackComponent={SettingsFallback}>
            {channel.slug !== 'general' && <ArchiveForm channel={channel} />}
          </SentryErrorBoundary>

          <SentryErrorBoundary fallbackComponent={SettingsFallback}>
            {channel.isPrivate && (
              <LoginTokenSettings id={channel.id} channel={channel} />
            )}
          </SentryErrorBoundary>
        </Column>

        <Column>
          {channel.isPrivate && (
            <span>
              <SentryErrorBoundary fallbackComponent={SettingsFallback}>
                <ChannelMembers
                  channel={channel}
                  id={channel.id}
                  initMessage={initMessage}
                />
              </SentryErrorBoundary>

              <SentryErrorBoundary fallbackComponent={SettingsFallback}>
                <PendingUsers
                  togglePending={this.props.togglePending}
                  channel={channel}
                  id={channel.id}
                  initMessage={initMessage}
                />
              </SentryErrorBoundary>

              <SentryErrorBoundary fallbackComponent={SettingsFallback}>
                <BlockedUsers
                  unblock={this.props.unblock}
                  channel={channel}
                  id={channel.id}
                  initMessage={initMessage}
                />
              </SentryErrorBoundary>
            </span>
          )}

          <SentryErrorBoundary fallbackComponent={SettingsFallback}>
            {!channel.isPrivate && <ChannelMembers id={channel.id} />}
          </SentryErrorBoundary>
        </Column>
      </SectionsContainer>
    );
  }
}

export default Overview;
