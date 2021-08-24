// @flow
import * as React from 'react';
import { SectionsContainer, Column } from 'src/components/settingsViews/style';
import EditForm from './editForm';
import ChannelMembers from './channelMembers';
import { ErrorBoundary, SettingsFallback } from 'src/components/error';

type Props = {
  community: Object,
  channel: Object,
  communitySlug: string,
};
class Overview extends React.Component<Props> {
  render() {
    const { channel } = this.props;

    return (
      <SectionsContainer data-cy="channel-overview">
        <Column>
          <ErrorBoundary fallbackComponent={SettingsFallback}>
            <EditForm channel={channel} />
          </ErrorBoundary>
        </Column>

        <Column>
          {channel.isPrivate && (
            <span>
              <ErrorBoundary fallbackComponent={SettingsFallback}>
                <ChannelMembers channel={channel} id={channel.id} />
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
