import * as React from 'react';
import { Link } from 'react-router-dom';
import { getCommunityChannels } from '../../community/queries';
import { connect } from 'react-redux';
import {
  changeActiveChannel,
  changeActiveThread,
} from '../../../actions/dashboardFeed';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { Loading } from '../../../components/loading';
import compose from 'recompose/compose';
import {
  ChannelsContainer,
  ChannelListItem,
  ChannelListDivider,
} from '../style';

type Props = {};
class SidebarChannels extends React.Component<Props> {
  changeChannel = id => {
    this.props.dispatch(changeActiveChannel(id));
    this.props.dispatch(changeActiveThread(''));
  };

  render() {
    const {
      data: { community },
      isLoading,
      queryVarIsChanging,
      activeChannel,
    } = this.props;

    if (community) {
      const { isMember, isOwner } = community.communityPermissions;
      const channels = community.channelConnection.edges
        .map(channel => channel.node)
        .filter(channel => {
          if (channel.isPrivate && !channel.channelPermissions.isMember) {
            return null;
          }

          return channel;
        })
        .filter(channel => !channel.channelPermissions.isBlocked);

      return (
        <ChannelsContainer>
          {channels.map(channel => {
            return (
              <ChannelListItem
                key={channel.id}
                active={activeChannel === channel.id}
                onClick={() => this.changeChannel(channel.id)}
              >
                {channel.name}
              </ChannelListItem>
            );
          })}

          <ChannelListDivider />
          <Link to={`/${community.slug}`}>
            <ChannelListItem>View community</ChannelListItem>
          </Link>

          {isOwner && (
            <Link to={`/${community.slug}/settings`}>
              <ChannelListItem>Settings</ChannelListItem>
            </Link>
          )}

          {isOwner &&
            community.isPro && (
              <Link to={`/${community.slug}/settings/settings`}>
                <ChannelListItem>Analytics</ChannelListItem>
              </Link>
            )}
        </ChannelsContainer>
      );
    }

    if (isLoading || queryVarIsChanging) {
      return (
        <ChannelsContainer>
          <Loading size={16} color={'text.alt'} />
        </ChannelsContainer>
      );
    }

    return null;
  }
}

export default compose(connect(), getCommunityChannels, viewNetworkHandler)(
  SidebarChannels
);
