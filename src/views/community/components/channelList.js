import * as React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import compose from 'recompose/compose';
import { ChannelListItem } from '../../../components/listItems';
import { ChannelProfile } from '../../../components/profile';
import { IconButton } from '../../../components/buttons';
import Icon from '../../../components/icons';
import { openModal } from '../../../actions/modals';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { LoadingCard } from '../../../components/loading';
import { getCommunityChannels } from '../queries';
import {
  StyledCard,
  ListHeader,
  ListHeading,
  ListContainer,
} from '../../../components/listItems/style';

type Props = {
  data: {
    community: Object,
  },
  isLoading: boolean,
  dispatch: Function,
  currentUser: Object,
  communitySlug: string,
};

class ChannelList extends React.Component<Props> {
  render() {
    const {
      isLoading,
      dispatch,
      currentUser,
      communitySlug,
      data: { community },
    } = this.props;

    if (community) {
      const { isMember, isOwner } = community.communityPermissions;
      const channels = community.channelConnection.edges
        .map(channel => channel.node)
        .filter(channel => {
          if (channel.isPrivate && !channel.channelPermissions.isMember)
            return null;

          return channel;
        })
        .filter(channel => !channel.channelPermissions.isBlocked);

      const joinedChannels = channels
        .slice()
        .filter(channel => channel.channelPermissions.isMember);
      const nonJoinedChannels = channels
        .slice()
        .filter(channel => !channel.channelPermissions.isMember);

      return (
        <StyledCard largeOnly>
          <ListHeader>
            <ListHeading>Channels</ListHeading>
            {isOwner && (
              <IconButton
                glyph="plus"
                color="text.placeholder"
                onClick={() =>
                  dispatch(openModal('CREATE_CHANNEL_MODAL', community))}
              />
            )}
          </ListHeader>

          {/*
            user isn't logged in, channel list is used for navigation
            or
            user is logged in but hasn't joined this community, channel list is used for navigation
          */}
          {(!currentUser || (currentUser && !isMember)) && (
              <ListContainer>
                {channels.map(channel => {
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
                        meta={
                          channel.metaData.members > 1
                            ? `${channel.metaData.members.toLocaleString()} members ${isOwner &&
                              channel.pendingUsers.length > 0
                                ? `(${channel.pendingUsers.length.toLocaleString()} pending)`
                                : ``}`
                            : `${channel.metaData.members} member ${isOwner &&
                              channel.pendingUsers.length > 0
                                ? `(${channel.pendingUsers.length.toLocaleString()} pending)`
                                : ``}`
                        }
                      >
                        <Icon glyph="view-forward" />
                      </ChannelListItem>
                    </Link>
                  );
                })}
              </ListContainer>
            )}

          {/* user is logged in and is a member of community, channel list is used to join/leave */}
          {joinedChannels &&
            isMember && (
              <ListContainer>
                {joinedChannels.map(channel => {
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
                        meta={
                          channel.metaData.members > 1
                            ? `${channel.metaData.members.toLocaleString()} members ${isOwner &&
                              channel.pendingUsers.length > 0
                                ? `(${channel.pendingUsers.length.toLocaleString()} pending)`
                                : ``}`
                            : `${channel.metaData.members} member ${isOwner &&
                              channel.pendingUsers.length > 0
                                ? `(${channel.pendingUsers.length.toLocaleString()} pending)`
                                : ``}`
                        }
                      >
                        <Icon glyph="view-forward" />
                      </ChannelListItem>
                    </Link>
                  );
                })}
              </ListContainer>
            )}

          {nonJoinedChannels.length > 0 &&
            isMember && (
              <span>
                <ListHeader secondary>
                  <ListHeading>Additional Channels</ListHeading>
                </ListHeader>

                <ListContainer>
                  <ul>
                    {nonJoinedChannels.map(channel => {
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
              </span>
            )}
        </StyledCard>
      );
    }

    if (isLoading) {
      return <LoadingCard />;
    }

    return null;
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(connect(map), getCommunityChannels, viewNetworkHandler)(
  ChannelList
);
