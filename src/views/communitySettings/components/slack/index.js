// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import getSlackSettings, {
  type GetSlackSettingsType,
} from 'shared/graphql/queries/community/getCommunitySlackSettings';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import { Loading } from 'src/components/loading';
import { SectionCard } from 'src/components/settingsViews/style';
import ViewError from 'src/components/viewError';
import SendInvitations from './sendInvitations';
import ConnectSlack from './connectSlack';
import ChannelConnection from './channelConnection';

type Props = {
  ...$Exact<ViewNetworkHandlerType>,
  data: {
    community: GetSlackSettingsType,
  },
  type: 'import-only' | 'bot-only',
};

export class Slack extends React.Component<Props> {
  render() {
    const { isLoading, data, type } = this.props;
    if (data.community) {
      const { slackSettings } = data.community;

      if (!slackSettings || !slackSettings.isConnected) {
        return <ConnectSlack community={data.community} isOnboarding={false} />;
      }

      if (type === 'import-only') {
        return <SendInvitations community={data.community} />;
      }

      if (type === 'bot-only') {
        return <ChannelConnection community={data.community} />;
      }

      return (
        <React.Fragment>
          <ChannelConnection id={data.community.id} />
          <SendInvitations community={data.community} />
        </React.Fragment>
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

export default compose(connect(), getSlackSettings, viewNetworkHandler)(Slack);
