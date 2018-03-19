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
import { FlexCol } from 'src/components/globals';
import { Card } from 'src/components/card';
import { LoadingList, LoadingListItem } from 'src/components/loading';
import { UserListItem } from 'src/components/listItems';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import ViewError from 'src/components/viewError';
import { MessageIconContainer } from '../style';

type Props = {
  data: {
    community: GetCommunityMembersType,
    fetchMore: Function,
  },
  dispatch: Function,
  isLoading: boolean,
  isFetchingMore: boolean,
  history: Object,
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

  render() {
    const { data: { community }, isLoading } = this.props;
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
            <div style={{ padding: '0 16px', background: '#fff' }}>
              <LoadingListItem />
            </div>
          }
          useWindow={false}
          initialLoad={false}
          scrollElement={scrollElement}
          threshold={750}
        >
          {nodes.map(node => {
            if (!node) return null;
            return (
              <div
                style={{ padding: '0 16px', background: '#fff' }}
                key={node.user.id}
              >
                <UserListItem key={node.user.id} user={node.user}>
                  <MessageIconContainer>
                    <Icon
                      glyph={'message'}
                      onClick={() => this.initMessage(node.user)}
                    />
                  </MessageIconContainer>
                </UserListItem>
              </div>
            );
          })}
        </InfiniteList>
      );
    }

    if (isLoading) {
      return <LoadingList />;
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
  connect(),
  withRouter,
  getCommunityMembersQuery,
  viewNetworkHandler
)(CommunityMemberGrid);
