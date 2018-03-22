// @flow
import * as React from 'react';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { ChannelListItem } from '../../../components/listItems';
import { ChannelProfile } from '../../../components/profile';
import { OutlineButton } from '../../../components/buttons';
import Icon from '../../../components/icons';
import { openModal } from '../../../actions/modals';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { Loading } from '../../../components/loading';
import getCommunityChannels from 'shared/graphql/queries/community/getCommunityChannelConnection';
import type { GetCommunityChannelConnectionType } from 'shared/graphql/queries/community/getCommunityChannelConnection';
import { StyledCard, ListContainer } from '../../../components/listItems/style';
import {
  ColumnHeading,
  ChannelListItemRow,
  ToggleNotificationsContainer,
} from '../style';
import ToggleChannelNotifications from 'src/components/toggleChannelNotifications';

type Props = {
  data: {
    community: GetCommunityChannelConnectionType,
  },
  isLoading: boolean,
  dispatch: Function,
  currentUser: Object,
  communitySlug: string,
};

class ChannelList extends React.Component<Props> {
  sortChannels = (array: Array<any>): Array<any> => {
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
          if (channel.isPrivate && !channel.channelPermissions.isMember)
            return null;

          return channel;
        })
        .filter(channel => channel && !channel.channelPermissions.isBlocked);
      const sortedChannels = this.sortChannels(channels);

      const joinedChannels = channels
        .slice()
        .filter(channel => channel && channel.channelPermissions.isMember);
      const sortedJoinedChannels = this.sortChannels(joinedChannels);

      const nonJoinedChannels = channels
        .slice()
        .filter(channel => channel && !channel.channelPermissions.isMember);
      const sortedNonJoinedChannels = this.sortChannels(nonJoinedChannels);

      return (
        <StyledCard largeOnly>
          {/*
            user isn't logged in, channel list is used for navigation
            or
            user is logged in but hasn't joined this community, channel list is used for navigation
          */}
          {(!currentUser || (currentUser && !isMember)) && (
            <ListContainer>
              {sortedChannels.map(channel => {
                if (!channel) return null;
                return (
                  <Link
                    key={channel.id}
                    to={`/${communitySlug}/${channel.slug}`}
                  >
                    <ChannelListItem
                      clickable
                      contents={channel}
                      withDescription={false}
                      channelIcon
                    >
                      <Icon glyph="view-forward" />
                    </ChannelListItem>
                  </Link>
                );
              })}
            </ListContainer>
          )}

          {/* user is logged in and is a member of community, channel list is used to join/leave */}
          {sortedJoinedChannels &&
            isMember && (
              <ListContainer>
                {sortedJoinedChannels.map(channel => {
                  if (!channel) return null;
                  return (
                    <ChannelListItemRow key={channel.id}>
                      <Link
                        to={`/${communitySlug}/${channel.slug}`}
                        style={{
                          display: 'flex',
                          flex: 'auto',
                        }}
                      >
                        <ChannelListItem
                          clickable
                          contents={channel}
                          withDescription={false}
                          channelIcon
                        />
                      </Link>
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
                                glyph={
                                  channel.channelPermissions
                                    .receiveNotifications
                                    ? 'notification-fill'
                                    : 'notification'
                                }
                              />
                            )}
                          </ToggleNotificationsContainer>
                        )}
                      />
                    </ChannelListItemRow>
                  );
                })}
              </ListContainer>
            )}

          {sortedNonJoinedChannels.length > 0 &&
            isMember && (
              <React.Fragment>
                <ColumnHeading>New channels</ColumnHeading>
                <ListContainer>
                  <ul>
                    {sortedNonJoinedChannels.map(channel => {
                      if (!channel) return null;
                      return (
                        <ChannelProfile
                          key={channel.id}
                          profileSize="listItemWithAction"
                          data={{ channel }}
                        />
                      );
                    })}
                  </ul>
                </ListContainer>
              </React.Fragment>
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

const map = state => ({ currentUser: state.users.currentUser });
export default compose(
  // $FlowIssue
  connect(map),
  getCommunityChannels,
  viewNetworkHandler
)(ChannelList);
