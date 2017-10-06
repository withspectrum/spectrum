import * as React from 'react';
import { Link } from 'react-router-dom';
import { getCommunityChannels } from '../../community/queries';
import { connect } from 'react-redux';
import Icon from '../../../components/icons';
import {
  changeActiveChannel,
  changeActiveThread,
} from '../../../actions/dashboardFeed';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { sortByDate } from '../../../helpers/utils';
import compose from 'recompose/compose';
import {
  ChannelsContainer,
  ChannelListItem,
  ChannelListDivider,
  LoadingContainer,
  LoadingBar,
} from '../style';

type Props = {};
class SidebarChannels extends React.Component<Props> {
  changeChannel = id => {
    this.props.dispatch(changeActiveThread(''));
    this.props.dispatch(changeActiveChannel(id));
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
        .filter(channel => {
          if (channel.isPrivate && !channel.community.isPro) {
            return null;
          }
          return channel;
        })
        .filter(channel => channel.channelPermissions.isMember)
        .filter(channel => !channel.channelPermissions.isBlocked);

      const sortedChannels = sortByDate(channels, 'createdAt', 'desc');

      return (
        <ChannelsContainer className={'channelsContainer'}>
          {sortedChannels.map(channel => {
            return (
              <ChannelListItem
                key={channel.id}
                active={activeChannel === channel.id}
                onClick={() => this.changeChannel(channel.id)}
              >
                {channel.isPrivate && (
                  <Icon glyph="channel-private" size={16} />
                )}

                {channel.name}
              </ChannelListItem>
            );
          })}

          <ChannelListDivider className={'divider'} />

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
        <ChannelsContainer className={'channelsContainer'}>
          <LoadingContainer>
            <LoadingBar width={56} />
            <LoadingBar width={128} />
            <LoadingBar width={72} />
          </LoadingContainer>
        </ChannelsContainer>
      );
    }

    return null;
  }
}

export default compose(connect(), getCommunityChannels, viewNetworkHandler)(
  SidebarChannels
);
