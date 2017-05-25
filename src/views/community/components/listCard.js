//@flow
import React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import { connect } from 'react-redux';
import { displayLoadingCard } from '../../../components/loading';
import { ListCardItem } from '../../../components/listCard';
import { Button, TextButton, IconButton } from '../../../components/buttons';
import Icon from '../../../components/icons';
import { NullCard, NullTitle, NullSubtitle } from '../../../components/upsell';
import { openModal } from '../../../actions/modals';

import {
  StyledCard,
  ListHeader,
  ListHeading,
  ListContainer,
  ListFooter,
} from '../../../components/listCard/style';

const ListCardPure = ({ data, dispatch }) => {
  const channels = data.community.channelConnection.edges;
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
                <ListCardItem
                  contents={channel}
                  withDescription={false}
                  meta={`
                    ${channel.metaData.members} members
                    ${data.community.communityPermissions.isOwner && channel.pendingUsers.length > 0 ? `· ${channel.pendingUsers.length} pending members` : ``}`}
                >
                  <Icon glyph="view-forward" />
                </ListCardItem>
              </Link>
            );
          })}
        </ListContainer>
        {data.community.isOwner &&
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
      <NullCard bg="community">
        <NullTitle>
          There are no channels here...
        </NullTitle>
        <NullSubtitle>
          Which really shouldn't be possible. Mind reloading?
        </NullSubtitle>
        <Button icon="reload">
          Reload
        </Button>
      </NullCard>
    );
  }
};

const ListCard = compose(displayLoadingCard)(ListCardPure);

export default connect()(ListCard);
