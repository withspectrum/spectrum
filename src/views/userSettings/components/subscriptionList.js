//@flow
import React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import { ListCardItem } from '../../../components/listCard';
import { IconButton, TextButton, Button } from '../../../components/buttons';

import {
  StyledCard,
  ListHeading,
  ListHeader,
  ListContainer,
  ListFooter,
  MoreLink,
} from '../../../components/listCard/style';

export const SubscriptionList = props => {
  const { data } = props;
  return (
    <StyledCard>
      <ListHeader>
        <ListHeading>Billing</ListHeading>
      </ListHeader>
      <ListContainer>
        {/* {channels.map(item => {
            return (
              <Link
                key={item.node.id}
                to={`/${data.variables.slug}/${item.node.slug}/settings`}
              >
                <ListCardItem
                  contents={item.node}
                  withDescription={false}
                  meta={`${item.node.metaData.members} members`}
                >
                  <IconButton glyph="settings" />
                </ListCardItem>
              </Link>
            );
          })} */}
      </ListContainer>
    </StyledCard>
  );
};
