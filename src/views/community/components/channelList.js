// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { OutlineButton } from 'src/components/buttons';
import Icon from 'src/components/icons';
import { openModal } from 'src/actions/modals';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { Loading } from 'src/components/loading';
import getCommunityChannels from 'shared/graphql/queries/community/getCommunityChannelConnection';
import type { GetCommunityChannelConnectionType } from 'shared/graphql/queries/community/getCommunityChannelConnection';
import { StyledCard, ListContainer } from 'src/components/listItems/style';
import { ChannelListItem } from 'src/components/listItems';
import ToggleChannelNotifications from 'src/components/toggleChannelNotifications';
import type { Dispatch } from 'redux';
import { ToggleNotificationsContainer } from '../style';
import { withCurrentUser } from 'src/components/withCurrentUser';

type Props = {
  data: {
    community: GetCommunityChannelConnectionType,
  },
  isLoading: boolean,
  dispatch: Dispatch<Object>,
  currentUser: Object,
  communitySlug: string,
};

class ChannelList extends React.Component<Props> {
  sortChannels = (array: Array<any>): Array<?any> => {
    if (!array || array.length === 0) return [];

    const generalChannel = array.find(channel => channel.slug === 'general');
    const withoutGeneral = array.filter(channel => channel.slug !== 'general');
    const sortedWithoutGeneral = withoutGeneral.sort((a, b) => {
      if (a.slug < b.slug) return -1;
      if (a.slug > b.slug) return 1;
      return 0;
    });
    if (generalChannel) {
      sortedWithoutGeneral.unshift(generalChannel);
      return sortedWithoutGeneral;
    } else {
      return sortedWithoutGeneral;
    }
  };
  render() {
    const {
      isLoading,
      dispatch,
      currentUser,
      communitySlug,
      data: { community },
    } = this.props;

    if (community && community.channelConnection) {
      const { isMember, isOwner } = community.communityPermissions;
      const channels = community.channelConnection.edges
        .map(channel => channel && channel.node)
        .filter(channel => {
          if (!channel) return null;
          if (channel.isArchived) return null;
          if (channel.isPrivate && !channel.channelPermissions.isMember)
            return null;

          return channel;
        })
        .filter(channel => channel && !channel.channelPermissions.isBlocked);

      const sortedChannels = this.sortChannels(channels);

      return (
        <StyledCard largeOnly style={{ padding: '0 16px' }}>
          {/*
            user isn't logged in, channel list is used for navigation
            or
            user is logged in but hasn't joined this community, channel list is used for navigation
          */}
          {(!currentUser || (currentUser && !isMember)) && (
            <ListContainer data-cy="channel-list">
              {sortedChannels.map(channel => {
                if (!channel) return null;
                return (
                  <ChannelListItem channel={channel} key={channel.id}>
                    <Link to={`/${communitySlug}/${channel.slug}`}>
                      <Icon glyph="view-forward" size={24} />
                    </Link>
                  </ChannelListItem>
                );
              })}
            </ListContainer>
          )}

          {isMember && !isOwner && (
            <ListContainer data-cy="channel-list">
              {sortedChannels.map(channel => {
                if (!channel) return null;
                return (
                  <ChannelListItem channel={channel} key={channel.id}>
                    <ToggleChannelNotifications
                      channel={channel}
                      render={state => (
                        <ToggleNotificationsContainer
                          tipLocation={'top-left'}
                          tipText={
                            channel.channelPermissions.receiveNotifications
                              ? 'Turn notifications off'
                              : 'Turn notifications on'
                          }
                        >
                          {state.isLoading ? (
                            <Loading />
                          ) : (
                            <Icon
                              size={24}
                              glyph={
                                channel.channelPermissions.receiveNotifications
                                  ? 'notification-fill'
                                  : 'notification'
                              }
                            />
                          )}
                        </ToggleNotificationsContainer>
                      )}
                    />
                  </ChannelListItem>
                );
              })}
            </ListContainer>
          )}

          {isOwner && (
            <ListContainer data-cy="channel-list">
              {sortedChannels.map(channel => {
                if (!channel) return null;
                return (
                  <ChannelListItem channel={channel} key={channel.id}>
                    <ToggleChannelNotifications
                      channel={channel}
                      render={state => (
                        <ToggleNotificationsContainer
                          tipLocation={'top-left'}
                          tipText={
                            channel.channelPermissions.receiveNotifications
                              ? 'Turn notifications off'
                              : 'Turn notifications on'
                          }
                        >
                          {state.isLoading ? (
                            <Loading />
                          ) : (
                            <Icon
                              size={24}
                              glyph={
                                channel.channelPermissions.receiveNotifications
                                  ? 'notification-fill'
                                  : 'notification'
                              }
                            />
                          )}
                        </ToggleNotificationsContainer>
                      )}
                    />

                    <div>
                      <Link to={`/${communitySlug}/${channel.slug}/settings`}>
                        <Icon
                          glyph="settings"
                          size={28}
                          tipLocation={'top-left'}
                          tipText={'Settings'}
                        />
                      </Link>
                    </div>
                  </ChannelListItem>
                );
              })}
            </ListContainer>
          )}

          {isOwner && (
            <OutlineButton
              style={{
                alignSelf: 'flex-end',
                marginTop: '12px',
              }}
              glyph="plus"
              onClick={() =>
                dispatch(openModal('CREATE_CHANNEL_MODAL', { community }))
              }
            >
              Create a channel
            </OutlineButton>
          )}
        </StyledCard>
      );
    }

    if (isLoading) {
      return (
        <div style={{ padding: '32px' }}>
          <Loading />
        </div>
      );
    }

    return null;
  }
}

export default compose(
  getCommunityChannels,
  viewNetworkHandler,
  withCurrentUser,
  connect()
)(ChannelList);
