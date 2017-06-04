//@flow
import React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import compose from 'recompose/compose';

import { displayLoadingCard } from '../../../components/loading';
import { ChannelListItem } from '../../../components/listItems';
import { FlexRow, FlexCol } from '../../../components/globals';
import Card from '../../../components/card';
import Icon from '../../../components/icons';

import {
  StyledCard,
  LargeListHeading,
  LargeListContainer,
  MoreLink,
} from '../../../components/listItems/style';

const ListCardPure = ({ data }) => {
  const channels = data.community.channelConnection.edges;
  if (!!channels) {
    return (
      <StyledCard>
        <LargeListHeading>Manage Channels</LargeListHeading>
        <LargeListContainer>
          {channels.map(item => {
            return (
              <Link
                key={item.node.id}
                to={`/${data.variables.slug}/${item.node.slug}/settings`}
              >
                <ChannelListItem
                  contents={item.node}
                  withDescription={false}
                  meta={`${item.node.metaData.members} members`}
                >
                  <Icon glyph="settings" />
                </ChannelListItem>
              </Link>
            );
          })}
        </LargeListContainer>
      </StyledCard>
    );
  } else {
    return <div />;
  }
};

const ListCard = compose(displayLoadingCard)(ListCardPure);

export default ListCard;
