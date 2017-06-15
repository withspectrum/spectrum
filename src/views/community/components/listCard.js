//@flow
import React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import { connect } from 'react-redux';
import { displayLoadingCard } from '../../../components/loading';
import { ChannelListItem } from '../../../components/listItems';
import { ChannelProfile } from '../../../components/profile';
import { Button, TextButton, IconButton } from '../../../components/buttons';
import Icon from '../../../components/icons';
import { NullCard } from '../../../components/upsell';
import { openModal } from '../../../actions/modals';

import {
  StyledCard,
  ListHeader,
  ListHeading,
  ListContainer,
  ListFooter,
} from '../../../components/listItems/style';

const ListCardPure = ({ data, dispatch }) => {
  let channels = data.community.channelConnection.edges;
  channels = channels
    .filter(channel => {
      if (!channel.node.isPrivate) {
        return channel;
      } else if (
        channel.node.isPrivate && !channel.node.channelPermissions.isMember
      ) {
        return null;
      } else {
        return channel;
      }
    })
    .map(channel => channel.node);

  const joinedChannels = channels.filter(
    channel => channel.channelPermissions.isMember
  );
  const nonJoinedChannels = channels.filter(
    channel => !channel.channelPermissions.isMember
  );

  console.log('joined', joinedChannels);
  console.log('nonjoined', nonJoinedChannels);

  if (!!channels) {
    return (
      <StyledCard>
        <ListHeader>
          <ListHeading>Your Channels</ListHeading>
          {data.community.communityPermissions.isOwner &&
            <IconButton
              glyph="plus"
              color="text.placeholder"
              onClick={() =>
                dispatch(openModal('CREATE_CHANNEL_MODAL', data.community))}
            />}
        </ListHeader>

        {!data.community.communityPermissions.isMember &&
          <ListContainer>
            {channels.map(channel => {
              return (
                <Link
                  key={channel.id}
                  to={`/${data.variables.slug}/${channel.slug}`}
                >
                  <ChannelListItem
                    clickable
                    contents={channel}
                    withDescription={false}
                    channelIcon
                    meta={
                      channel.metaData.members > 1
                        ? `${channel.metaData.members} members ${data.community.communityPermissions.isOwner && channel.pendingUsers.length > 0 ? `(${channel.pendingUsers.length} pending)` : ``}`
                        : `${channel.metaData.members} member ${data.community.communityPermissions.isOwner && channel.pendingUsers.length > 0 ? `(${channel.pendingUsers.length} pending)` : ``}`
                    }
                  >
                    <Icon glyph="view-forward" />
                  </ChannelListItem>
                </Link>
              );
            })}
          </ListContainer>}

        {joinedChannels &&
          data.community.communityPermissions.isMember &&
          <ListContainer>
            {joinedChannels.map(channel => {
              return (
                <Link
                  key={channel.id}
                  to={`/${data.variables.slug}/${channel.slug}`}
                >
                  <ChannelListItem
                    clickable
                    contents={channel}
                    withDescription={false}
                    channelIcon
                    meta={
                      channel.metaData.members > 1
                        ? `${channel.metaData.members} members ${data.community.communityPermissions.isOwner && channel.pendingUsers.length > 0 ? `(${channel.pendingUsers.length} pending)` : ``}`
                        : `${channel.metaData.members} member ${data.community.communityPermissions.isOwner && channel.pendingUsers.length > 0 ? `(${channel.pendingUsers.length} pending)` : ``}`
                    }
                  >
                    <Icon glyph="view-forward" />
                  </ChannelListItem>
                </Link>
              );
            })}
          </ListContainer>}

        {nonJoinedChannels.length > 0 &&
          data.community.communityPermissions.isMember &&
          <span>
            <ListHeader secondary>
              <ListHeading>Discover Channels</ListHeading>
              {data.community.communityPermissions.isOwner &&
                <IconButton
                  glyph="plus"
                  color="text.placeholder"
                  onClick={() =>
                    dispatch(openModal('CREATE_CHANNEL_MODAL', data.community))}
                />}
            </ListHeader>

            <ListContainer>
              {nonJoinedChannels.map(channel => {
                console.log('channel', channel);
                return (
                  <ChannelProfile
                    key={channel.id}
                    profileSize="listItemWithAction"
                    data={{ channel }}
                  />
                );
                // <Link
                //   key={channel.id}
                //   to={`/${data.variables.slug}/${channel.slug}`}
                // >
                //   <ChannelListItem
                //     clickable
                //     contents={channel}
                //     withDescription={false}
                //     channelIcon
                //     meta={
                //       channel.metaData.members > 1
                //         ? `${channel.metaData.members} members ${data.community.communityPermissions.isOwner && channel.pendingUsers.length > 0 ? `(${channel.pendingUsers.length} pending)` : ``}`
                //         : `${channel.metaData.members} member ${data.community.communityPermissions.isOwner && channel.pendingUsers.length > 0 ? `(${channel.pendingUsers.length} pending)` : ``}`
                //     }
                //   >
                //     <Icon glyph="view-forward" />
                //   </ChannelListItem>
                // </Link>
              })}
            </ListContainer>
          </span>}

        {data.community.communityPermissions.isOwner &&
          <ListFooter>
            <TextButton
              onClick={() =>
                dispatch(openModal('CREATE_CHANNEL_MODAL', data.community))}
            >
              Create a Channel
            </TextButton>
          </ListFooter>}
      </StyledCard>
    );
  } else {
    return (
      <NullCard
        bg="community"
        heading={`There are no channels here...`}
        copy={`Which really shouldn't be possible. Mind reloading?`}
      >
        <Button icon="view-reload" onClick={() => location.reload(true)}>
          Reload
        </Button>
      </NullCard>
    );
  }
};

const ListCard = compose(displayLoadingCard)(ListCardPure);

export default connect()(ListCard);
