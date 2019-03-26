// @flow
import * as React from 'react';
import { SectionsContainer, Column } from 'src/components/settingsViews/style';
import EditForm from './editForm';
import PendingUsers from './pendingUsers';
import BlockedUsers from './blockedUsers';
import ChannelMembers from './channelMembers';
import ArchiveForm from './archiveForm';
import LoginTokenSettings from './joinTokenSettings';
import SlackConnection from 'src/views/communitySettings/components/slack';
import { ErrorBoundary, SettingsFallback } from 'src/components/error';

type Props = {
  community: Object,
  channel: Object,
  communitySlug: string,
  togglePending: Function,
  unblock: Function,
};
class Overview extends React.Component<Props> {
  render() {
    const { channel, community } = this.props;

    return (
      <SectionsContainer data-cy="channel-overview">
        <Column>
          <ErrorBoundary fallbackComponent={SettingsFallback}>
            <EditForm channel={channel} />
          </ErrorBoundary>

          <ErrorBoundary fallbackComponent={SettingsFallback}>
            <SlackConnection
              type={'bot-only'}
              id={community.id}
              channelFilter={channel.id}
            />
          </ErrorBoundary>

          <ErrorBoundary fallbackComponent={SettingsFallback}>
            {channel.slug !== 'general' && <ArchiveForm channel={channel} />}
          </ErrorBoundary>

          <ErrorBoundary fallbackComponent={SettingsFallback}>
            {channel.isPrivate && (
              <LoginTokenSettings id={channel.id} channel={channel} />
            )}
          </ErrorBoundary>
        </Column>

        <Column>
          {channel.isPrivate && (
            <span>
              <ErrorBoundary fallbackComponent={SettingsFallback}>
                <ChannelMembers channel={channel} id={channel.id} />
              </ErrorBoundary>

              <ErrorBoundary fallbackComponent={SettingsFallback}>
                <PendingUsers
                  togglePending={this.props.togglePending}
                  channel={channel}
                  id={channel.id}
                />
              </ErrorBoundary>

              <ErrorBoundary fallbackComponent={SettingsFallback}>
                <BlockedUsers
                  unblock={this.props.unblock}
                  channel={channel}
                  id={channel.id}
                />
              </ErrorBoundary>
            </span>
          )}

          <ErrorBoundary fallbackComponent={SettingsFallback}>
            {!channel.isPrivate && (
              <ChannelMembers channel={channel} id={channel.id} />
            )}
          </ErrorBoundary>
        </Column>
      </SectionsContainer>
    );
  }
}

export default Overview;
