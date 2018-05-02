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
import { ChannelListContainer } from './style';

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
          <SectionTitle style={{ marginTop: '-4px' }}>
            <img
              alt={'slack icon'}
              src={'/img/slack_colored.png'}
              width={48}
              height={48}
              style={{ marginLeft: '-8px', marginRight: '4px' }}
            />
            Get conversation notifications in Slack
          </SectionTitle>
          <SectionSubtitle>
            Keep up with your community by sending notifications about new
            conversations to individual channels in Slack.
          </SectionSubtitle>

          <ChannelListContainer>
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
          </ChannelListContainer>
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
