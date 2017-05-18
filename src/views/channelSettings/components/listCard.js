//@flow
import React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import compose from 'recompose/compose';

import { displayLoadingCard } from '../../../components/loading';
import { ListCardItem } from '../../../components/listCardItem';
import { FlexRow, FlexCol } from '../../../components/globals';
import Card from '../../../components/card';
import Icon from '../../../components/icons';

import { StyledCard, ListHeading, ListContainer, MoreLink } from '../style';

const ListCardPure = ({ data }) => {
  const channels = data.community.channelConnection.edges;
  if (!!channels) {
    return (
      <StyledCard>
        <ListHeading>Manage Channels</ListHeading>
        <ListContainer>
          {channels.map(item => {
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
                  <Icon glyph="settings" />
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
