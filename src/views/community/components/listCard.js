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
  channels = channels.filter(channel => {
    if (!channel.node.isPrivate) {
      return channel;
    } else if (
      channel.node.isPrivate && !channel.node.channelPermissions.isMember
    ) {
      return null;
    } else {
      return channel;
    }
  });

  if (!!channels) {
    return (
      <StyledCard>
        <ListHeader>
          <ListHeading>Channels</ListHeading>
          {data.community.communityPermissions.isOwner &&
            <IconButton
              glyph="plus"
              color="text.placeholder"
              onClick={() =>
                dispatch(openModal('CREATE_CHANNEL_MODAL', data.community))}
            />}
        </ListHeader>
        <ListContainer>
          {channels.map(item => {
            const channel = item.node;
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
                    item.node.metaData.members > 1
                      ? `${item.node.metaData.members} members ${data.community.communityPermissions.isOwner && channel.pendingUsers.length > 0 ? `(${channel.pendingUsers.length} pending)` : ``}`
                      : `${item.node.metaData.members} member ${data.community.communityPermissions.isOwner && channel.pendingUsers.length > 0 ? `(${channel.pendingUsers.length} pending)` : ``}`
                  }
                >
                  <Icon glyph="view-forward" />
                </ChannelListItem>
              </Link>
            );
          })}
        </ListContainer>
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
