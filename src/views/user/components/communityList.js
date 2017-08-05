//@flow
import React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import { withRouter } from 'react-router';
//$FlowFixMe
import compose from 'recompose/compose';
import { CommunityListItem } from '../../../components/listItems';
import Icon from '../../../components/icons';
import { NullCard } from '../../../components/upsell';
import { LoadingList } from '../../../components/loading';

import {
  StyledCard,
  ListHeading,
  ListHeader,
  ListContainer,
} from '../../../components/listItems/style';

const CommunityList = props => {
  const {
    communities,
    currentUser,
    user,
    withDescription,
    withMeta,
    networkStatus,
  } = props;

  const dataExists =
    communities && communities.length !== 0 && communities !== null;

  if (networkStatus === 8) {
    return (
      <NullCard
        heading={`Something went wrong loading ${user.username}'s communities...`}
        bg={'error'}
      />
    );
  }

  if (dataExists) {
    return (
      <StyledCard largeOnly>
        <ListHeader>
          {user === currentUser
            ? <ListHeading>My Communities</ListHeading>
            : <ListHeading>Member of</ListHeading>}
        </ListHeader>
        <ListContainer>
          {communities.map(item => {
            return (
              <Link key={item.node.id} to={`/${item.node.slug}`}>
                <CommunityListItem
                  contents={item.node}
                  withDescription={withDescription}
                  withMeta={withMeta}
                  meta={`${item.node.metaData.members > 1
                    ? `${item.node.metaData.members} members`
                    : `${item.node.metaData.members} member`}
                     ·
                    ${item.node.metaData.channels > 1
                      ? `${item.node.metaData.channels} channels`
                      : `${item.node.metaData.channels} channel`}`}
                >
                  <Icon glyph="view-forward" />
                </CommunityListItem>
              </Link>
            );
          })}
        </ListContainer>
      </StyledCard>
    );
  }

  if (networkStatus === 7) {
    return (
      <NullCard
        heading={`${user.username} isn't a member of any communities yet.`}
        bg={'community'}
      />
    );
  } else {
    return <LoadingList />;
  }
};

export default compose(withRouter, connect())(CommunityList);
