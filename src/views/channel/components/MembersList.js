// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import { withRouter } from 'react-router';
import getChannelMembersQuery, {
  type GetChannelMemberConnectionType,
} from 'shared/graphql/queries/channel/getChannelMemberConnection';
import { Card } from 'src/components/card';
import { Loading } from 'src/components/loading';
import NextPageButton from 'src/components/nextPageButton';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import ViewError from 'src/components/viewError';
import { UserListItem } from 'src/components/entities';
import type { Dispatch } from 'redux';
import { withCurrentUser } from 'src/components/withCurrentUser';

type Props = {
  data: {
    channel: GetChannelMemberConnectionType,
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
      data: { channel },
      isLoading,
      currentUser,
      isFetchingMore,
    } = this.props;

    if (channel && channel.memberConnection) {
      const { edges: members, pageInfo } = channel.memberConnection;
      const nodes = members.map(member => member && member.node);
      const uniqueNodes = deduplicateChildren(nodes, 'id');
      const { hasNextPage } = pageInfo;

      return (
        <React.Fragment>
          {uniqueNodes.map(user => {
            if (!user) return null;

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
          {hasNextPage && (
            <NextPageButton
              isFetchingMore={isFetchingMore}
              fetchMore={this.props.data.fetchMore}
              bottomOffset={-100}
            >
              Load more members
            </NextPageButton>
          )}
        </React.Fragment>
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
  getChannelMembersQuery,
  viewNetworkHandler,
  connect()
)(MembersList);
