//@flow
import React, { Component } from 'react';
import { UserListItem } from '../listItems';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
import { LoadingCard } from '../loading';
import ViewError from '../viewError';
import { getCommunityMembersQuery } from '../../api/community';
import { FetchMoreButton } from '../threadFeed/style';
import {
  StyledCard,
  ListHeader,
  LargeListHeading,
  ListContainer,
  ListFooter,
} from '../listItems/style';

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
    } else if (error) {
      return (
        <StyledCard>
          <ViewError />
        </StyledCard>
      );
    } else {
      return (
        <StyledCard>
          <ListHeader>
            <LargeListHeading>{totalCount} Members</LargeListHeading>
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

          {community.memberConnection.pageInfo.hasNextPage && (
            <ListFooter>
              <FetchMoreButton
                color={'brand.default'}
                loading={networkStatus === 3}
                onClick={() => fetchMore()}
              >
                Load more
              </FetchMoreButton>
            </ListFooter>
          )}
        </StyledCard>
      );
    }
  }
}

export default compose(getCommunityMembersQuery, pure)(CommunityMembers);
