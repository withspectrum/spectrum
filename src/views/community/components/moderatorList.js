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
import { MessageIconContainer, ListColumn } from '../style';
import GranularUserProfile from 'src/components/granularUserProfile';
import { UpsellTeamMembers } from 'src/components/upsell';
import type { Dispatch } from 'redux';

type Props = {
  data: {
    community: GetCommunityMembersType,
    fetchMore: Function,
  },
  dispatch: Dispatch<Object>,
  isLoading: boolean,
  isFetchingMore: boolean,
  history: Object,
  currentUser: ?Object,
};

class CommunityModeratorList extends React.Component<Props> {
  shouldComponentUpdate(nextProps) {
    // NOTE(@brian) This is needed to avoid conflicting the the members tab in
    // the community view. See https://github.com/withspectrum/spectrum/pull/2613#pullrequestreview-105861623
    // for discussion
    // never update once we have the list of team members
    if (
      this.props.data &&
      this.props.data.community &&
      this.props.data.community.id === nextProps.data.community.id
    ) {
      return false;
    }
    return true;
  }

  initMessage = user => {
    this.props.dispatch(initNewThreadWithUser(user));
    return this.props.history.push('/messages/new');
  };

  render() {
    const {
      data: { community },
      isLoading,
      currentUser,
    } = this.props;

    if (community && community.members) {
      const { edges: members } = community.members;
      const nodes = members
        .map(member => member && member.node)
        .filter(node => node && (node.isOwner || node.isModerator))
        .filter(Boolean);

      const currentUserIsOwner =
        currentUser &&
        nodes.find(node => node.user.id === currentUser.id && node.isOwner);

      return (
        <ListColumn>
          {nodes.map(node => {
            const { user, roles } = node;

            return (
              <GranularUserProfile
                key={user.id}
                userObject={user}
                name={user.name}
                profilePhoto={user.profilePhoto}
                isCurrentUser={currentUser && user.id === currentUser.id}
                isOnline={user.isOnline}
                onlineSize={'small'}
                badges={roles}
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
            );
          })}
          {currentUserIsOwner && (
            <UpsellTeamMembers
              communitySlug={community.slug}
              small={nodes.length > 1}
            />
          )}
        </ListColumn>
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
