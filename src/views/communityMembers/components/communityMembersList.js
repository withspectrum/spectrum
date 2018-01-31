// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Loading } from '../../../components/loading';
import ViewError from '../../../components/viewError';
import { Button } from '../../../components/buttons';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import type { ViewNetworkHandlerType } from '../../../components/viewNetworkHandler';
import getCommunityMembersQuery from 'shared/graphql/queries/community/getCommunityMemberConnection';
import type { GetCommunityMemberConnectionType } from 'shared/graphql/queries/community/getCommunityMemberConnection';
import { ListContainer } from '../../../components/listItems/style';
import { initNewThreadWithUser } from '../../../actions/directMessageThreads';
import { SectionCardFooter } from '../../../components/settingsViews/style';
import GranularUserProfile from '../../../components/granularUserProfile';
import { FetchMore } from '../style';

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

                const badge =
                  user.contextPermissions && user.contextPermissions.isOwner
                    ? 'Admin'
                    : user.contextPermissions &&
                      user.contextPermissions.isModerator
                      ? 'Moderator'
                      : null;

                const reputation =
                  user.contextPermissions &&
                  user.contextPermissions.reputation.toString();

                return (
                  <GranularUserProfile
                    key={user.id}
                    id={user.id}
                    name={user.name}
                    username={user.username}
                    description={user.description}
                    isCurrentUser={user.id === currentUser.id}
                    isOnline={user.isOnline}
                    onlineSize={'small'}
                    profilePhoto={user.profilePhoto}
                    avatarSize={'40'}
                    isPro={user.isPro}
                    badge={badge}
                    reputation={reputation}
                  >
                    <Button>Edit user</Button>
                    <Button>Message user</Button>
                  </GranularUserProfile>
                );
              })}
          </ListContainer>

          {community.memberConnection.pageInfo.hasNextPage && (
            <SectionCardFooter>
              <FetchMore
                color={'brand.default'}
                loading={isFetchingMore}
                onClick={() => fetchMore()}
              >
                Load more
              </FetchMore>
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
