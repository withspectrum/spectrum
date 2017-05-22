// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import { connect } from 'react-redux';
import { getThisChannel } from './queries';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import { displayLoadingScreen } from '../../components/loading';
import { ChannelEditForm } from '../../components/editForm';
import PendingUsers from './components/pendingUsers';
import BlockedUsers from './components/blockedUsers';
import { Upsell404Channel } from '../../components/upsell';

const SettingsPure = ({
  match,
  data: { error, channel },
  dispatch,
  history,
}) => {
  const communitySlug = match.params.communitySlug;
  const channelSlug = match.params.channelSlug;
  console.log(channel);
  if (error) {
    return <Upsell404Channel channel={channelSlug} community={communitySlug} />;
  }

  if (!channel || channel.isDeleted) {
    return <Upsell404Channel channel={channelSlug} community={communitySlug} />;
  }

  if (
    !channel.channelPermissions.isOwner &&
    !channel.community.communityPermissions.isOwner
  ) {
    return (
      <Upsell404Channel
        channel={channelSlug}
        community={communitySlug}
        noPermission
      />
    );
  }

  return (
    <AppViewWrapper>
      <Column type="secondary">
        <ChannelEditForm channel={channel} />
      </Column>
      <Column type="primary">
        <PendingUsers users={channel.pendingUsers} channel={channel} />
        {channel.blockedUsers.length > 0 &&
          <BlockedUsers users={channel.blockedUsers} channel={channel} />}
      </Column>
    </AppViewWrapper>
  );
};

const ChannelSettings = compose(getThisChannel, displayLoadingScreen, pure)(
  SettingsPure
);
export default connect()(ChannelSettings);
