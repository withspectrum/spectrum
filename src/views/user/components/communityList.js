//@flow
import React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import { connect } from 'react-redux';
import { CommunityListItem } from '../../../components/listItems';
import { Button, IconButton } from '../../../components/buttons';
import Icon from '../../../components/icons';
import { NullCard } from '../../../components/upsell';
import { openModal } from '../../../actions/modals';

import {
  StyledCard,
  ListHeading,
  ListHeader,
  ListContainer,
  ListFooter,
  MoreLink,
} from '../../../components/listItems/style';

const CommunityList = props => {
  const {
    communities,
    dispatch,
    currentUser,
    user,
    withDescription,
    withMeta,
  } = props;

  const filteredCommunities = communities.filter(
    community =>
      community.node.communityPermissions.isMember ||
      community.node.communityPermissions.isOwner
  );

  if (
    filteredCommunities &&
    (filteredCommunities.length !== 0 && filteredCommunities !== null)
  ) {
    return (
      <StyledCard>
        <ListHeader>
          <ListHeading>Member of</ListHeading>
          {currentUser &&
            currentUser.id === user.id &&
            <IconButton
              glyph="plus"
              color="text.placeholder"
              hoverColor="brand.alt"
              onClick={() => dispatch(openModal('CREATE_COMMUNITY_MODAL'))}
            />}
        </ListHeader>
        <ListContainer>
          {filteredCommunities.map(item => {
            return (
              <Link key={item.node.id} to={`/${item.node.slug}`}>
                <CommunityListItem
                  contents={item.node}
                  withDescription={withDescription}
                  withMeta={withMeta}
                  meta={`${item.node.metaData.members > 1 ? `${item.node.metaData.members} members` : `${item.node.metaData.members} member`}
                     ·
                    ${item.node.metaData.channels > 1 ? `${item.node.metaData.channels} channels` : `${item.node.metaData.channels} channel`}`}
                >
                  <Icon glyph="view-forward" />
                </CommunityListItem>
              </Link>
            );
          })}
        </ListContainer>
        <ListFooter>
          <MoreLink to={`/explore`}>Find more...</MoreLink>
        </ListFooter>
      </StyledCard>
    );
  } else {
    return (
      <NullCard
        bg="community"
        heading={`You're fresh out of communities!`}
        copy={`Let's find you something worth joining...`}
      >
        <Button icon="explore" color="text.alt" gradientTheme="">
          Browse communities
        </Button>
      </NullCard>
    );
  }
};

export default connect()(CommunityList);
