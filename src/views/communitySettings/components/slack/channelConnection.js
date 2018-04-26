// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import getCommunityChannelsSlackSettingsQuery, {
  type GetCommunityChannelsSlackSettings,
} from 'shared/graphql/queries/community/getCommunityChannelsSlackSettings';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
} from 'src/components/settingsViews/style';
import updateChannelSlackSettingsMutation from 'shared/graphql/mutations/channel/updateSlackSettings';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import { Loading } from 'src/components/loading';
import ViewError from 'src/components/viewError';
import ChannelSlackManager from './channelSlackManager';

type Props = {
  ...$Exact<ViewNetworkHandlerType>,
  data: {
    community: GetCommunityChannelsSlackSettings,
  },
  updateChannelSlackSettings: Function,
  dispatch: Function,
  channelFilter?: string,
};

class SlackChannelConnection extends React.Component<Props> {
  render() {
    const { data, isLoading, channelFilter } = this.props;

    if (data.community) {
      let channels = data.community.channelConnection.edges.map(
        e => e && e.node
      );
      if (channelFilter) {
        channels = channels.filter(c => c && c.id === channelFilter);
      }
      const slackChannels = data.community.slackSettings.slackChannelList;

      return (
        <SectionCard>
          <SectionTitle>Spectrum Slack Bot</SectionTitle>
          <SectionSubtitle>
            When a new conversation is started in your community, it can be
            cross posted to any of your Slack channels.
          </SectionSubtitle>

          {channels.map(channel => {
            if (!channel) return null;

            return (
              <ChannelSlackManager
                key={channel.id}
                channel={channel}
                slackChannels={slackChannels}
              />
            );
          })}
        </SectionCard>
      );
    }

    if (isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return (
      <SectionCard>
        <ViewError />
      </SectionCard>
    );
  }
}

export default compose(
  connect(),
  updateChannelSlackSettingsMutation,
  getCommunityChannelsSlackSettingsQuery,
  viewNetworkHandler
)(SlackChannelConnection);
