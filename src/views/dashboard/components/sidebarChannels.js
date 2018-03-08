// @flow
import * as React from 'react';
import Link from 'src/components/link';
import getCommunityChannels from 'shared/graphql/queries/community/getCommunityChannelConnection';
import type { GetCommunityChannelConnectionType } from 'shared/graphql/queries/community/getCommunityChannelConnection';
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

type Props = {
  dispatch: Function,
  isLoading: boolean,
  queryVarIsChanging: boolean,
  activeChannel: ?string,
  thisCommunity: {
    slug: string,
    communityPermissions: {
      isOwner: boolean,
      isModerator: boolean,
    },
  },
  data: {
    community: GetCommunityChannelConnectionType,
  },
};
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

    const { communityPermissions: { isOwner, isModerator } } = thisCommunity;

    if (community) {
      const { isOwner, isModerator } = community.communityPermissions;
      const channels = community.channelConnection.edges
        .map(channel => channel && channel.node)
        .filter(channel => {
          if (!channel) return null;
          if (channel.isPrivate && !channel.channelPermissions.isMember) {
            return null;
          }

          return channel;
        })
        .filter(channel => {
          if (!channel) return null;
          if (channel.isPrivate && channel.isArchived) {
            return null;
          }
          return channel;
        })
        .filter(channel => channel && channel.channelPermissions.isMember)
        .filter(channel => channel && !channel.channelPermissions.isBlocked)
        .filter(channel => channel && !channel.isArchived);

      const sortedChannels = sortByTitle(channels);

      return (
        <ChannelsContainer className={'channelsContainer'}>
          <Link to={`/${community.slug}`}>
            <ChannelListItem>
              <Icon glyph={'link'} size={24} />
              <CommunityListName>Visit community</CommunityListName>
            </ChannelListItem>
          </Link>

          {isOwner ||
            (isModerator && (
              <Link to={`/${community.slug}/settings`}>
                <ChannelListItem>
                  <Icon glyph={'settings'} size={24} />
                  <CommunityListName>Settings</CommunityListName>
                </ChannelListItem>
              </Link>
            ))}

          {isOwner ||
            (isModerator &&
              community.hasFeatures.analytics && (
                <Link to={`/${community.slug}/settings/analytics`}>
                  <ChannelListItem>
                    <Icon glyph={'link'} size={24} />
                    <CommunityListName>Analytics</CommunityListName>
                  </ChannelListItem>
                </Link>
              ))}

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
                  onClick={evt => {
                    evt.stopPropagation();
                    this.changeChannel(channel.id);
                  }}
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
          <Link to={`/${thisCommunity.slug}`}>
            <ChannelListItem>
              <Icon glyph={'link'} size={24} />
              <CommunityListName>Visit community</CommunityListName>
            </ChannelListItem>
          </Link>

          {isOwner ||
            (isModerator && (
              <Link to={`/${thisCommunity.slug}/settings`}>
                <ChannelListItem>
                  <Icon glyph={'settings'} size={24} />
                  <CommunityListName>Settings</CommunityListName>
                </ChannelListItem>
              </Link>
            ))}

          {isOwner ||
            (isModerator &&
              thisCommunity.hasFeatures.analytics && (
                <Link to={`/${thisCommunity.slug}/settings/analytics`}>
                  <ChannelListItem>
                    <Icon glyph={'link'} size={24} />
                    <CommunityListName>Analytics</CommunityListName>
                  </ChannelListItem>
                </Link>
              ))}
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
