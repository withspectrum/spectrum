import * as React from 'react';
import Link from 'src/components/link';
import { getCommunityChannels } from '../../community/queries';
import { connect } from 'react-redux';
import Icon from '../../../components/icons';
import {
  changeActiveChannel,
  changeActiveThread,
} from '../../../actions/dashboardFeed';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { sortByTitle } from '../../../helpers/utils';
import compose from 'recompose/compose';
import {
  CommunityListName,
  ChannelsContainer,
  ChannelListItem,
  LoadingContainer,
  LoadingBar,
  SectionTitle,
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
      thisCommunity,
      isLoading,
      queryVarIsChanging,
      activeChannel,
    } = this.props;

    const { communityPermissions: { isOwner } } = thisCommunity;

    if (community) {
      const { isOwner } = community.communityPermissions;
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

      const sortedChannels = sortByTitle(channels);

      return (
        <ChannelsContainer className={'channelsContainer'}>
          <Link
            to={`/${thisCommunity.slug}`}
            target="_blank"
            rel="nofollower noopener"
          >
            <ChannelListItem>
              <Icon glyph={'link'} size={24} />
              <CommunityListName>Visit community</CommunityListName>
            </ChannelListItem>
          </Link>

          {isOwner && (
            <Link
              to={`/${thisCommunity.slug}/settings`}
              target="_blank"
              rel="nofollower noopener"
            >
              <ChannelListItem>
                <Icon glyph={'settings'} size={24} />
                <CommunityListName>Settings</CommunityListName>
              </ChannelListItem>
            </Link>
          )}

          {isOwner &&
            thisCommunity.isPro && (
              <Link
                to={`/${thisCommunity.slug}/settings/analytics`}
                target="_blank"
                rel="nofollower noopener"
              >
                <ChannelListItem>
                  <Icon glyph={'link'} size={24} />
                  <CommunityListName>Analytics</CommunityListName>
                </ChannelListItem>
              </Link>
            )}

          {sortedChannels &&
            sortedChannels.length > 1 && (
              <SectionTitle>Filter by Channel</SectionTitle>
            )}
          {sortedChannels &&
            sortedChannels.length > 1 &&
            sortedChannels.map(channel => {
              return (
                <ChannelListItem
                  key={channel.id}
                  active={activeChannel === channel.id}
                  onClick={() => this.changeChannel(channel.id)}
                >
                  {channel.isPrivate ? (
                    <Icon glyph="channel-private" size={24} />
                  ) : (
                    <Icon glyph="channel" size={24} />
                  )}

                  <CommunityListName>{channel.name}</CommunityListName>
                </ChannelListItem>
              );
            })}
        </ChannelsContainer>
      );
    }

    if (isLoading || queryVarIsChanging) {
      return (
        <ChannelsContainer className={'channelsContainer'}>
          <Link
            to={`/${thisCommunity.slug}`}
            target="_blank"
            rel="nofollower noopener"
          >
            <ChannelListItem>
              <Icon glyph={'link'} size={24} />
              <CommunityListName>Visit community</CommunityListName>
            </ChannelListItem>
          </Link>

          {isOwner && (
            <Link
              to={`/${thisCommunity.slug}/settings`}
              target="_blank"
              rel="nofollower noopener"
            >
              <ChannelListItem>
                <Icon glyph={'settings'} size={24} />
                <CommunityListName>Settings</CommunityListName>
              </ChannelListItem>
            </Link>
          )}

          {isOwner &&
            thisCommunity.isPro && (
              <Link
                to={`/${thisCommunity.slug}/settings/analytics`}
                target="_blank"
                rel="nofollower noopener"
              >
                <ChannelListItem>
                  <Icon glyph={'link'} size={24} />
                  <CommunityListName>Analytics</CommunityListName>
                </ChannelListItem>
              </Link>
            )}
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
