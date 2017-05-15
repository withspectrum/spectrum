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
import { TextButton } from '../../../components/buttons';
import { FlexRow } from '../../../components/globals';
import Icon from '../../../components/icons';
import { openModal } from '../../../actions/modals';

import { StyledCard, ListHeading, ListContainer, MoreLink } from '../style';

const ListCardPure = ({ data: { communities }, dispatch }) => {
  if (!!communities) {
    return (
      <StyledCard>
        <ListHeading>My Communities</ListHeading>
        <ListContainer>
          {communities.map(item => {
            return (
              <Link key={item.node.id} to={`/${item.node.slug}`}>
                <ListCardItem
                  contents={item.node}
                  withDescription={false}
                  meta={`${item.node.metaData.members} members · ${item.node.metaData.frequencies} frequencies`}
                >
                  <Icon glyph="forward" />
                </ListCardItem>
              </Link>
            );
          })}
        </ListContainer>
        <FlexRow>
          <MoreLink to={`/explore`}>Find more...</MoreLink>
          <TextButton
            onClick={() => dispatch(openModal('CREATE_COMMUNITY_MODAL'))}
          >
            Start community
          </TextButton>
        </FlexRow>
      </StyledCard>
    );
  } else {
    return <div />;
  }
};

const ListCard = compose(displayLoadingCard)(ListCardPure);

export default connect()(ListCard);
