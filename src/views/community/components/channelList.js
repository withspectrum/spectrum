// @flow
import * as React from 'react';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { ChannelListItem } from '../../../components/listItems';
import { ChannelProfile } from '../../../components/profile';
import { IconButton } from '../../../components/buttons';
import Icon from '../../../components/icons';
import { openModal } from '../../../actions/modals';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { LoadingCard } from '../../../components/loading';
import getCommunityChannels from 'shared/graphql/queries/community/getCommunityChannelConnection';
import type { GetCommunityChannelConnectionType } from 'shared/graphql/queries/community/getCommunityChannelConnection';
import {
  StyledCard,
  ListHeader,
  ListHeading,
  ListContainer,
} from '../../../components/listItems/style';

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

    if (community && community.id) {
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
          <ListHeader>
            <ListHeading>Channels</ListHeading>
            {isOwner && (
              <IconButton
                glyph="plus"
                color="text.placeholder"
                onClick={() =>
                  dispatch(
                    openModal('CREATE_CHANNEL_MODAL', {
                      community,
                      id: community.id,
                    })
                  )
                }
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

          {sortedNonJoinedChannels.length > 0 &&
            isMember && (
              <span>
                <ListHeader secondary>
                  <ListHeading>New channels</ListHeading>
                </ListHeader>

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
export default compose(
  // $FlowIssue
  connect(map),
  getCommunityChannels,
  viewNetworkHandler
)(ChannelList);
