//@flow
import React, { Component } from 'react';
import { UserListItem } from '../listItems';
import { Button } from '../buttons';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
import { LoadingCard } from '../loading';
import { NullCard } from '../upsell';
import { getCommunityMembersQuery } from '../../api/community';
import { FetchMoreButton } from '../threadFeed/style';
import {
  StyledCard,
  ListHeader,
  LargeListHeading,
  ListContainer,
  ListFooter,
} from '../listItems/style';

const ErrorState = () =>
  <NullCard
    bg="error"
    heading={`Whoops!`}
    copy={`Something went wrong on our end... Mind reloading?`}
  >
    <Button icon="view-reload" onClick={() => window.location.reload(true)}>
      Reload
    </Button>
  </NullCard>;

class CommunityMembers extends Component {
  render() {
    const { data: { error, community, networkStatus, fetchMore } } = this.props;
    const members =
      community &&
      community.memberConnection &&
      community.memberConnection.edges.map(member => member.node);
    const totalCount =
      community && community.metaData && community.metaData.members;

    if (networkStatus === 1) {
      return <LoadingCard />;
    } else if (
      (error && community.memberConnection.edges.length > 0) ||
      (error && community.memberConnection.edges.length === 0)
    ) {
      return <ErrorState />;
    } else {
      return (
        <StyledCard>
          <ListHeader>
            <LargeListHeading>Members · {totalCount}</LargeListHeading>
          </ListHeader>

          <ListContainer>
            {members &&
              members.map(user => {
                return (
                  <section key={user.id}>
                    <UserListItem user={user} />
                  </section>
                );
              })}
          </ListContainer>

          {community.memberConnection.pageInfo.hasNextPage &&
            <ListFooter>
              <FetchMoreButton
                color={'brand.default'}
                loading={networkStatus === 3}
                onClick={() => fetchMore()}
              >
                Load more
              </FetchMoreButton>
            </ListFooter>}
        </StyledCard>
      );
    }
  }
}

export default compose(getCommunityMembersQuery, pure)(CommunityMembers);
