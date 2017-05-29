//@flow
import React from 'react';
//$FlowFixMe
// import { Link } from 'react-router-dom';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
// import compose from 'recompose/compose';
//$FlowFixMe
// import pure from 'recompose/pure';
import { ListCardItem } from '../../../components/listCard';
import { IconButton } from '../../../components/buttons';
import { openModal } from '../../../actions/modals';

import {
  StyledCard,
  LargeListHeading,
  ListHeader,
  ListContainer,
  // ListFooter,
  // MoreLink,
} from '../../../components/listCard/style';

const SubscriptionList = ({ data, currentUser, dispatch }) => {
  const ProSubscriptionContent = {
    name: 'Pro Account',
  };
  const ProSubscriptionMeta = '$5 / month · Since March 2017';

  const PaidCommunityContent = {
    name: 'Spectrum',
  };
  const PaidCommunityMeta = 'Cultivate · $800/month · 8,000 users';

  const openProModal = () => {
    dispatch(openModal('UPGRADE_MODAL', { user: currentUser }));
  };
  // const { data } = props;
  return (
    <StyledCard>
      <ListHeader>
        <LargeListHeading>Billing</LargeListHeading>
      </ListHeader>
      <ListContainer>
        <ListCardItem
          contents={ProSubscriptionContent}
          withDescription={false}
          meta={ProSubscriptionMeta}
          // TODO: onClick={() => openModal(proModal)}
        >
          <IconButton glyph="settings" onClick={openProModal} />
        </ListCardItem>

        <ListCardItem
          contents={PaidCommunityContent}
          withDescription={false}
          meta={PaidCommunityMeta}
          // TODO: onClick={() => openModal(proModal)}
        >
          <IconButton glyph="settings" onClick={openProModal} />
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

export default connect()(SubscriptionList);
