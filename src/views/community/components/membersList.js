// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import InfiniteList from 'src/components/infiniteScroll';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import { withRouter } from 'react-router';
import getCommunityMembersQuery, {
  type GetCommunityMembersType,
} from 'shared/graphql/queries/community/getCommunityMembers';
import { Card } from 'src/components/card';
import { Loading, LoadingListItem } from 'src/components/loading';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import ViewError from 'src/components/viewError';
import { UserListItem } from 'src/components/entities';
import type { Dispatch } from 'redux';
import { withCurrentUser } from 'src/components/withCurrentUser';

type Props = {
  data: {
    community: GetCommunityMembersType,
    fetchMore: Function,
    networkStatus: number,
  },
  dispatch: Dispatch<Object>,
  isLoading: boolean,
  isFetchingMore: boolean,
  history: Object,
  currentUser: ?Object,
};

class MembersList extends React.Component<Props> {
  shouldComponentUpdate(nextProps) {
    const curr = this.props;
    // fetching more
    if (curr.data.networkStatus === 7 && nextProps.data.networkStatus === 3)
      return false;
    return true;
  }

  render() {
    const {
      data: { community },
      isLoading,
      currentUser,
    } = this.props;

    if (community) {
      const { edges: members } = community.members;
      const nodes = members.map(member => member && member.node);
      const uniqueNodes = deduplicateChildren(nodes, 'id');
      const hasNextPage = community.members.pageInfo.hasNextPage;

      return (
        <InfiniteList
          pageStart={0}
          loadMore={this.props.data.fetchMore}
          hasMore={hasNextPage}
          loader={<LoadingListItem key={0} />}
          useWindow={false}
          initialLoad={false}
          threshold={750}
        >
          {uniqueNodes.map(node => {
            if (!node) return null;

            const { user } = node;
            return (
              <UserListItem
                key={user.id}
                userObject={user}
                name={user.name}
                username={user.username}
                description={user.description}
                profilePhoto={user.profilePhoto}
                isCurrentUser={currentUser && user.id === currentUser.id}
                isOnline={user.isOnline}
                avatarSize={40}
                showHoverProfile={false}
                messageButton={currentUser && user.id !== currentUser.id}
              />
            );
          })}
        </InfiniteList>
      );
    }

    if (isLoading) {
      return <Loading />;
    }

    return (
      <Card>
        <ViewError
          refresh
          heading={'We weren’t able to fetch the members of this community.'}
        />
      </Card>
    );
  }
}

export default compose(
  withRouter,
  withCurrentUser,
  getCommunityMembersQuery,
  viewNetworkHandler,
  connect()
)(MembersList);
