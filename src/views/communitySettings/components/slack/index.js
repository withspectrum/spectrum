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
  isOnboarding: boolean,
  channelFilter?: string,
};

export class Slack extends React.Component<Props> {
  render() {
    const {
      isLoading,
      hasError,
      data,
      type,
      isOnboarding,
      channelFilter,
    } = this.props;

    if (
      data.community &&
      (data.community.communityPermissions.isOwner ||
        data.community.communityPermissions.isModerator)
    ) {
      const { slackSettings } = data.community;

      if (!slackSettings || !slackSettings.isConnected) {
        return (
          <ConnectSlack
            community={data.community}
            isOnboarding={isOnboarding}
          />
        );
      }

      if (type === 'import-only') {
        return (
          <SendInvitations id={data.community.id} community={data.community} />
        );
      }

      if (type === 'bot-only') {
        return (
          <ChannelConnection
            id={data.community.id}
            channelFilter={channelFilter}
          />
        );
      }

      return (
        <React.Fragment>
          <ChannelConnection
            id={data.community.id}
            channelFilter={channelFilter}
          />
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

    if (hasError) {
      return (
        <SectionCard>
          <ViewError />
        </SectionCard>
      );
    }

    return null;
  }
}

export default compose(connect(), getSlackSettings, viewNetworkHandler)(Slack);
