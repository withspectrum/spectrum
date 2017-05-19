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
import { TextButton } from '../../../components/buttons';
import Icon from '../../../components/icons';
import { openModal } from '../../../actions/modals';

import { StyledCard, ListHeading, ListContainer, MoreLink } from '../style';

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
        <FlexRow>
          <MoreLink to={`/explore`}>Find more...</MoreLink>
        </FlexRow>
        <FlexRow>
          {data.community.isOwner &&
            <TextButton
              onClick={() =>
                dispatch(openModal('CREATE_CHANNEL_MODAL', data.community))}
            >
              Create a Channel
            </TextButton>}
        </FlexRow>
      </StyledCard>
    );
  } else {
    return <div />;
  }
};

const ListCard = compose(displayLoadingCard)(ListCardPure);

export default connect()(ListCard);
