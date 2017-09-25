//@flow
import React, { Component } from 'react';
import { UserListItem } from '../listItems';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
import { LoadingCard } from '../loading';
import { getChannelMembersQuery } from '../../api/channel';
import { FetchMoreButton } from '../threadFeed/style';
import ViewError from '../viewError';
import viewNetworkHandler from '../viewNetworkHandler';
import {
  StyledCard,
  ListHeader,
  LargeListHeading,
  ListContainer,
  ListFooter,
} from '../listItems/style';

class ChannelMembers extends Component {
  render() {
    const {
      data: { channel, fetchMore },
      isLoading,
      isFetchingMore,
      hasError,
    } = this.props;

    if (isLoading) {
      return <LoadingCard />;
    }

    if (hasError || !channel) {
      return (
        <StyledCard>
          <ViewError />
        </StyledCard>
      );
    }

    const members =
      channel.memberConnection &&
      channel.memberConnection.edges.map(member => member.node);
    const totalCount = channel.metaData && channel.metaData.members;

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

        {channel.memberConnection.pageInfo.hasNextPage && (
          <ListFooter>
            <FetchMoreButton
              color={'brand.default'}
              loading={isFetchingMore}
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

export default compose(getChannelMembersQuery, viewNetworkHandler, pure)(
  ChannelMembers
);
