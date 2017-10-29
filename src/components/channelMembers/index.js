//@flow
import React, { Component } from 'react';
import { UserListItem } from '../listItems';
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

type Props = {
  data: {
    channel: Object,
    fetchMore: Function,
  },
  isLoading: boolean,
  isFetchingMore: boolean,
};

class ChannelMembers extends Component<Props> {
  render() {
    const {
      data: { channel, fetchMore },
      data,
      isLoading,
      isFetchingMore,
    } = this.props;

    if (data && data.channel) {
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
                    <UserListItem
                      user={user}
                      reputationTipText={'Rep in this community'}
                    />
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

    if (isLoading) {
      return <LoadingCard />;
    }

    return (
      <StyledCard>
        <ViewError />
      </StyledCard>
    );
  }
}

export default compose(getChannelMembersQuery, viewNetworkHandler)(
  ChannelMembers
);
