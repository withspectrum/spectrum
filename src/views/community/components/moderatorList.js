// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Icon from 'src/components/icons';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';
import { withRouter } from 'react-router';
import getCommunityMembersQuery, {
  type GetCommunityMembersType,
} from 'shared/graphql/queries/community/getCommunityMembers';
import { Card } from 'src/components/card';
import { Loading } from 'src/components/loading';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import ViewError from 'src/components/viewError';
import { MessageIconContainer, UserListItemContainer } from '../style';
import GranularUserProfile from 'src/components/granularUserProfile';

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

class CommunityModeratorList extends React.Component<Props> {
  shouldComponentUpdate() {
    // NOTE(@brian) This is needed to avoid conflicting the the members tab in
    // the community view. See https://github.com/withspectrum/spectrum/pull/2613#pullrequestreview-105861623
    // for discussion
    // never update once we have the list of team members
    if (this.props.data && this.props.data.community) return false;
    return true;
  }

  initMessage = user => {
    this.props.dispatch(initNewThreadWithUser(user));
    return this.props.history.push('/messages/new');
  };

  render() {
    const { data: { community }, isLoading, currentUser } = this.props;

    if (community && community.members) {
      const { edges: members } = community.members;
      const nodes = members.map(member => member && member.node);

      return (
        <div>
          {nodes.map(node => {
            if (!node) return null;
            return (
              <UserListItemContainer key={node.user.id}>
                <GranularUserProfile
                  userObject={node.user}
                  id={node.user.id}
                  name={node.user.name}
                  isCurrentUser={currentUser && node.user.id === currentUser.id}
                  isOnline={node.user.isOnline}
                  onlineSize={'small'}
                  profilePhoto={node.user.profilePhoto}
                  avatarSize={'32'}
                  badges={node.roles}
                >
                  {currentUser &&
                    node.user.id !== currentUser.id && (
                      <MessageIconContainer>
                        <Icon
                          glyph={'message'}
                          onClick={() => this.initMessage(node.user)}
                        />
                      </MessageIconContainer>
                    )}
                </GranularUserProfile>
              </UserListItemContainer>
            );
          })}
        </div>
      );
    }

    if (isLoading) {
      return (
        <div style={{ padding: '32px' }}>
          <Loading />
        </div>
      );
    }

    return (
      <Card>
        <ViewError
          refresh
          heading={
            'We weren’t able to fetch the team that owns this community.'
          }
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
)(CommunityModeratorList);
