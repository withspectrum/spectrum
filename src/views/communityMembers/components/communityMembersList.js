// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { UserListItem } from '../../../components/listItems';
import compose from 'recompose/compose';
import Icon from '../../../components/icons';
import { Loading } from '../../../components/loading';
import ViewError from '../../../components/viewError';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import type { ViewNetworkHandlerType } from '../../../components/viewNetworkHandler';
import getCommunityMembersQuery from 'shared/graphql/queries/community/getCommunityMemberConnection';
import type { GetCommunityMemberConnectionType } from 'shared/graphql/queries/community/getCommunityMemberConnection';
import { FetchMoreButton } from '../../../components/threadFeed/style';
import { ListContainer } from '../../../components/listItems/style';
import { initNewThreadWithUser } from '../../../actions/directMessageThreads';
import {
  MessageIcon,
  SectionCardFooter,
} from '../../../components/settingsViews/style';

type Props = {
  data: {
    fetchMore: Function,
    community: GetCommunityMemberConnectionType,
  },
  setTotalCount: Function,
  currentUser: Object,
  ...$Exact<ViewNetworkHandlerType>,
  dispatch: Function,
  history: Object,
};

class CommunityMembers extends React.Component<Props> {
  initMessage = user => {
    this.props.dispatch(initNewThreadWithUser(user));
    this.props.history.push('/messages/new');
  };

  componentDidUpdate(prev) {
    const curr = this.props;

    if (!prev.data.community && curr.data.community) {
      const count = curr.data.community.metaData.members.toLocaleString();
      this.props.setTotalCount(count);
    }
  }

  render() {
    const {
      data: { community, fetchMore },
      currentUser,
      isLoading,
      isFetchingMore,
    } = this.props;

    const members =
      community &&
      community.memberConnection &&
      community.memberConnection.edges.map(member => member && member.node);

    if (isLoading) {
      return <Loading />;
    }

    if (community && community.id) {
      return (
        <React.Fragment>
          <ListContainer>
            {members &&
              members.map(user => {
                if (!user) return null;

                return (
                  <section key={user.id}>
                    <UserListItem
                      user={user}
                      reputationTipText={'Rep in this community'}
                    >
                      {// don't message yourself
                      user.id !== currentUser.id && (
                        <MessageIcon
                          tipText={`Message ${user.name}`}
                          tipLocation={'top-left'}
                          onClick={() => this.initMessage(user)}
                        >
                          <Icon glyph="message-new" size={32} />
                        </MessageIcon>
                      )}
                    </UserListItem>
                  </section>
                );
              })}
          </ListContainer>

          {community.memberConnection.pageInfo.hasNextPage && (
            <SectionCardFooter>
              <FetchMoreButton
                color={'brand.default'}
                loading={isFetchingMore}
                onClick={() => fetchMore()}
              >
                Load more
              </FetchMoreButton>
            </SectionCardFooter>
          )}
        </React.Fragment>
      );
    }

    return <ViewError small />;
  }
}

const map = state => ({ currentUser: state.users.currentUser });

export default compose(
  // $FlowIssue
  connect(map),
  getCommunityMembersQuery,
  viewNetworkHandler
)(CommunityMembers);
