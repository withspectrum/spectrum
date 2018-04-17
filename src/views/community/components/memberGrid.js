// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import InfiniteList from 'react-infinite-scroller-with-scroll-element';
import Icon from 'src/components/icons';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';
import { withRouter } from 'react-router';
import getCommunityMembersQuery, {
  type GetCommunityMembersType,
} from 'shared/graphql/queries/community/getCommunityMembers';
import { Card } from 'src/components/card';
import { Loading, LoadingListItem } from 'src/components/loading';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import ViewError from 'src/components/viewError';
import { MessageIconContainer, UserListItemContainer } from '../style';
import GranularUserProfile from 'src/components/granularUserProfile';
import { fetchMoreOnInfiniteScrollLoad } from 'src/helpers/infiniteScroll';

type Props = {
  data: {
    community: GetCommunityMembersType,
    fetchMore: Function,
  },
  dispatch: Function,
  isLoading: boolean,
  isFetchingMore: boolean,
  history: Object,
  currentUser: ?Object,
};

type State = {
  scrollElement: any,
};

class CommunityMemberGrid extends React.Component<Props, State> {
  state = { scrollElement: null };

  componentDidMount() {
    this.setState({
      // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
      // the AppViewWrapper which is the scrolling part of the site.
      scrollElement: document.getElementById('scroller-for-thread-feed'),
    });
  }

  initMessage = user => {
    this.props.dispatch(initNewThreadWithUser(user));
    return this.props.history.push('/messages/new');
  };

  shouldComponentUpdate(nextProps) {
    const curr = this.props;
    // fetching more
    if (curr.data.networkStatus === 7 && nextProps.data.networkStatus === 3)
      return false;
    return true;
  }

  componentDidUpdate(prevProps) {
    const curr = this.props;
    const scrollElement = document.getElementById('scroller-for-thread-feed');

    if (
      curr.data &&
      curr.data.community &&
      curr.data.community.members &&
      curr.data.community.members.edges.length > 0 &&
      prevProps.data &&
      prevProps.data.community &&
      prevProps.data.community.members &&
      prevProps.data.community.members.edges.length > 0 &&
      curr.data.community.members.edges.length >
        prevProps.data.community.members.edges.length
    ) {
      const hasNextPage = curr.data.community.members.pageInfo.hasNextPage;
      if (
        fetchMoreOnInfiniteScrollLoad(
          scrollElement,
          'scroller-for-community-members-list'
        ) &&
        this.props.data.fetchMore &&
        hasNextPage
      ) {
        return this.props.data.fetchMore();
      }
    }
  }

  render() {
    const { data: { community }, isLoading, currentUser } = this.props;
    const { scrollElement } = this.state;

    if (community) {
      const { edges: members } = community.members;
      const nodes = members.map(member => member && member.node);
      const hasNextPage = community.members.pageInfo.hasNextPage;

      return (
        <InfiniteList
          pageStart={0}
          loadMore={this.props.data.fetchMore}
          hasMore={hasNextPage}
          loader={
            <UserListItemContainer>
              <LoadingListItem />
            </UserListItemContainer>
          }
          useWindow={false}
          initialLoad={false}
          scrollElement={scrollElement}
          threshold={750}
          className={'scroller-for-community-members-list'}
        >
          {nodes.map(node => {
            if (!node) return null;

            const { user, roles, reputation } = node;
            return (
              <GranularUserProfile
                key={user.id}
                userObject={user}
                name={user.name}
                username={user.username}
                profilePhoto={user.profilePhoto}
                description={user.description}
                isCurrentUser={currentUser && user.id === currentUser.id}
                isOnline={user.isOnline}
                onlineSize={'small'}
                badges={roles}
                reputation={reputation}
              >
                {currentUser &&
                  user.id !== currentUser.id && (
                    <MessageIconContainer>
                      <Icon
                        glyph={'message'}
                        onClick={() => this.initMessage(user)}
                      />
                    </MessageIconContainer>
                  )}
              </GranularUserProfile>
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

const map = state => ({ currentUser: state.users.currentUser });

export default compose(
  // $FlowIssue
  connect(map),
  withRouter,
  getCommunityMembersQuery,
  viewNetworkHandler
)(CommunityMemberGrid);
