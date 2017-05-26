//@flow
import React from 'react';
//$FlowFixMe
// import { Link } from 'react-router-dom';
//$FlowFixMe
// import { connect } from 'react-redux';
//$FlowFixMe
// import compose from 'recompose/compose';
//$FlowFixMe
// import pure from 'recompose/pure';
import { ListCardItem } from '../../../components/listCard';
import { IconButton, TextButton, Button } from '../../../components/buttons';

import {
  StyledCard,
  ListHeading,
  ListHeader,
  ListContainer,
  // ListFooter,
  // MoreLink,
} from '../../../components/listCard/style';

const ProSubscriptionContent = {
  name: 'Pro Account',
};

const ProSubscriptionMeta = '$5 / month · Since March 2017';

export const SubscriptionList = (props: Object) => {
  // const { data } = props;
  return (
    <StyledCard>
      <ListHeader>
        <ListHeading>Billing</ListHeading>
      </ListHeader>
      <ListContainer>
        <ListCardItem
          contents={ProSubscriptionContent}
          withDescription={false}
          meta={ProSubscriptionMeta}
          // TODO: onClick={() => openModal(proModal)}
        >
          <IconButton glyph="settings" />
        </ListCardItem>
        {/* TODO: {communities.map(item => {
            return (
              <Link
                key={item.node.id}
                to={`/${item.node.slug}/settings`}
              >
                <ListCardItem
                  contents={item.node}
                  withDescription={false}
                  meta={`${item.node.plan.name} · ${item.node.plan.cost}· ${item.node.metaData.members} members`}
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
