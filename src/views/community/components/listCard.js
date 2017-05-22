//@flow
import React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import { connect } from 'react-redux';
import { displayLoadingCard } from '../../../components/loading';
import { ListCardItem } from '../../../components/listCardItem';
import { FlexRow } from '../../../components/globals';
import { Button, TextButton } from '../../../components/buttons';
import Icon from '../../../components/icons';
import { NullCard, NullTitle, NullSubtitle } from '../../../components/upsell';
import { openModal } from '../../../actions/modals';

import { StyledCard, ListHeading, ListContainer, ListFooter } from '../style';

const ListCardPure = ({ data, dispatch }) => {
  const channels = data.community.channelConnection.edges;
  if (!!channels) {
    return (
      <StyledCard>
        <ListHeading>Channels</ListHeading>
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
