//@flow
import React, { Component } from 'react';
import { UserListItem } from '../../../components/listItems';
import compose from 'recompose/compose';
import { Loading } from '../../../components/loading';
import { getChannelMembersQuery } from '../../../api/channel';
import { FetchMoreButton } from '../../../components/threadFeed/style';
import ViewError from '../../../components/viewError';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import {
  SectionCard,
  SectionTitle,
} from '../../../components/settingsViews/style';
import { ListContainer, ListFooter } from '../../../components/listItems/style';

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
      const totalCount =
        channel.metaData && channel.metaData.members.toLocaleString();

      return (
        <SectionCard>
          <SectionTitle>
            {totalCount === 1
              ? `${totalCount} member`
              : `${totalCount} members`}
          </SectionTitle>

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
        </SectionCard>
      );
    }

    if (isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return (
      <SectionCard>
        <ViewError />
      </SectionCard>
    );
  }
}

export default compose(getChannelMembersQuery, viewNetworkHandler)(
  ChannelMembers
);
