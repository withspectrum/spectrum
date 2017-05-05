//@flow
import React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import compose from 'recompose/compose';

import { displayLoadingCard } from '../../../components/loading';
import { ListCardItem } from '../../../components/listCardItem';
import { FlexCol, FlexRow } from '../../../components/globals';
import Icon from '../../../components/icons';

import { StyledCard, ListHeading, ListContainer, MoreLink } from '../style';

const ListCardPure = ({ data: { communities } }) => {
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
                <Icon
                  icon="forward"
                  color={'text.alt'}
                  hoverColor={'brand.alt'}
                  scaleOnHover={false}
                />
              </ListCardItem>
            </Link>
          );
        })}
      </ListContainer>
      <FlexRow>
        <MoreLink to={`/explore`}>Find More</MoreLink>
      </FlexRow>
    </StyledCard>
  );
};

const ListCard = compose(displayLoadingCard)(ListCardPure);

export default ListCard;
