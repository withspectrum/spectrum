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
import { Button, IconButton } from '../../../components/buttons';
import Icon from '../../../components/icons';
import { NullCard } from '../../../components/upsell';
import { LoadingList, LoadingListItem } from '../../../components/loading';
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
    history,
    networkStatus,
  } = props;

  const dataExists =
    communities && communities.length !== 0 && communities !== null;

  if (networkStatus === 7) {
    if (dataExists) {
      return (
        <StyledCard>
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
    } else {
      return (
        <NullCard
          heading={`${user.username} isn't a member of any communities yet.`}
          bg={'community'}
        />
      );
    }
  } else if (networkStatus === 8) {
    console.log("communities didn't load. here's the props", props);
    return (
      <NullCard
        heading={`Something went wrong loading ${user.username}'s communities...`}
        bg={'error'}
      />
    );
  } else {
    console.log("communities didn't load. here's the props", props);
    return <LoadingList />;
  }
};

export default compose(withRouter, connect())(CommunityList);
