//@flow
import React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import compose from 'recompose/compose';
import { openModal } from '../../../actions/modals';
import { displayLoadingCard } from '../../../components/loading';
import { ChannelListItem } from '../../../components/listItems';
import { IconButton, Button } from '../../../components/buttons';

import { StyledCard, ListHeading, ListContainer, ListHeader } from '../style';

const ListCardPure = ({ data, dispatch }) => {
  const channels = data.community.channelConnection.edges;
  if (!!channels) {
    return (
      <StyledCard>
        <ListHeader>
          <ListHeading>Manage Channels</ListHeading>
          <Button
            icon={'plus'}
            onClick={() =>
              dispatch(openModal('CREATE_CHANNEL_MODAL', data.community))}
          >
            Create Channel
          </Button>
        </ListHeader>
        <ListContainer>
          {channels.map(item => {
            return (
              <Link
                key={item.node.id}
                to={`/${data.variables.slug}/${item.node.slug}/settings`}
              >
                <ChannelListItem
                  contents={item.node}
                  withDescription={false}
                  meta={`${item.node.metaData.members.toLocaleString()} members`}
                >
                  <IconButton glyph="settings" />
                </ChannelListItem>
              </Link>
            );
          })}
        </ListContainer>
      </StyledCard>
    );
  } else {
    return <div />;
  }
};

const ListCard = compose(displayLoadingCard, connect())(ListCardPure);

export default ListCard;
