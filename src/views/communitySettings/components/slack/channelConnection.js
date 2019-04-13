// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import getCommunityChannelsSlackSettingsQuery, {
  type GetCommunityChannelsSlackSettings,
} from 'shared/graphql/queries/community/getCommunityChannelsSlackSettings';
import {
  SectionCard,
  SectionTitleWithIcon,
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
import Icon from 'src/components/icon';
import type { Dispatch } from 'redux';

type Props = {
  ...$Exact<ViewNetworkHandlerType>,
  data: {
    community: GetCommunityChannelsSlackSettings,
  },
  updateChannelSlackSettings: Function,
  dispatch: Dispatch<Object>,
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
          <SectionTitleWithIcon>
            <Icon glyph={'slack-colored'} size={32} />
            Get conversation notifications in Slack
          </SectionTitleWithIcon>
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
