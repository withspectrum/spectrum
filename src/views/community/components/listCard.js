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
            return (
              <Link
                key={item.node.id}
                to={`/${data.variables.slug}/${item.node.slug}`}
              >
                <ListCardItem
                  contents={item.node}
                  withDescription={false}
                  meta={`${item.node.metaData.members} members`}
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
