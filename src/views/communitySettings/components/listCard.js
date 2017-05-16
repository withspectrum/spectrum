//@flow
import React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import compose from 'recompose/compose';

import { displayLoadingCard } from '../../../components/loading';
import { ListCardItem } from '../../../components/listCardItem';
import IconButton from '../../../components/buttons';

import { StyledCard, ListHeading, ListContainer } from '../style';

const ListCardPure = ({ data }) => {
  const frequencies = data.community.frequencyConnection.edges;
  if (!!frequencies) {
    return (
      <StyledCard>
        <ListHeading>Manage Frequencies</ListHeading>
        <ListContainer>
          {frequencies.map(item => {
            return (
              <Link
                key={item.node.id}
                to={`/${data.variables.slug}/${item.node.slug}/settings`}
              >
                <ListCardItem
                  contents={item.node}
                  withDescription={false}
                  meta={`${item.node.metaData.subscribers} members`}
                >
                  <IconButton glyph="settings" />
                </ListCardItem>
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

const ListCard = compose(displayLoadingCard)(ListCardPure);

export default ListCard;
