//@flow
import React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import compose from 'recompose/compose';

import { displayLoadingCard } from '../../../components/loading';
import { ListCardItem } from '../../../components/listCardItem';
import { FlexRow } from '../../../components/globals';
import Icon from '../../../components/icons';

import { StyledCard, ListHeading, ListContainer, MoreLink } from '../style';

const ListCardPure = ({ data }) => {
  const frequencies = data.community.frequencyConnection.edges;
  if (!!frequencies) {
    return (
      <StyledCard>
        <ListHeading>Frequencies</ListHeading>
        <ListContainer>
          {frequencies.map(item => {
            return (
              <Link
                key={item.node.id}
                to={`/${data.variables.slug}/${item.node.slug}`}
              >
                <ListCardItem
                  contents={item.node}
                  withDescription={false}
                  meta={`${item.node.metaData.subscribers} members`}
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
          <MoreLink to={`/explore`}>Find more...</MoreLink>
        </FlexRow>
      </StyledCard>
    );
  } else {
    return <div />;
  }
};

const ListCard = compose(displayLoadingCard)(ListCardPure);

export default ListCard;
