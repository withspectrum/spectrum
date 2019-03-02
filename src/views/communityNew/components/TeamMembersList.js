// @flow
import React from 'react';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import getCommunityMembersQuery from 'shared/graphql/queries/community/getCommunityMembers';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import GranularUserProfile from 'src/components/granularUserProfile';
import Icon from 'src/components/icons';
import { withCurrentUser } from 'src/components/withCurrentUser';
import type { TeamMemberListType } from '../types';
import {
  List,
  VerticalScroll,
  SidebarSectionHeader,
  SidebarSectionHeading,
} from '../style';

class Component extends React.Component<TeamMemberListType> {
  shouldComponentUpdate(nextProps) {
    // NOTE(@brian) This is needed to avoid conflicting the the members tab in
    // the community view. See https://github.com/withspectrum/spectrum/pull/2613#pullrequestreview-105861623
    // for discussion
    // never update once we have the list of team members
    if (
      this.props.data.community &&
      nextProps.data.community &&
      this.props.data.community.id === nextProps.data.community.id
    ) {
      return false;
    }

    return true;
  }

  render() {
    const {
      isLoading,
      hasError,
      queryVarIsChanging,
      data,
      currentUser,
    } = this.props;

    const isOwner = this.props.community.communityPermissions.isOwner;

    if (isLoading || queryVarIsChanging) return <p>Loading</p>;
    if (hasError) return <p>Error</p>;

    const { community } = data;

    const { edges: members } = community.members;

    const nodes = members
      .map(member => member && member.node)
      .filter(node => node && (node.isOwner || node.isModerator))
      .filter(Boolean);

    return (
      <React.Fragment>
        <SidebarSectionHeader>
          <SidebarSectionHeading>Team</SidebarSectionHeading>
          {isOwner && (
            <Link to={`/${community.slug}/settings/members`}>
              <Icon
                glyph={'settings'}
                tipLocation={'left'}
                tipText={'Add team members'}
                size={24}
              />
            </Link>
          )}
        </SidebarSectionHeader>

        <List>
          {nodes.map(({ user }) => (
            <GranularUserProfile
              key={user.id}
              userObject={user}
              name={user.name}
              username={user.username}
              profilePhoto={user.profilePhoto}
              isCurrentUser={currentUser && user.id === currentUser.id}
              isOnline={user.isOnline}
              avatarSize={40}
              showHoverProfile={false}
              messageButton={currentUser && user.id !== currentUser.id}
            />
          ))}
        </List>
      </React.Fragment>
    );
  }
}

export const TeamMembersList = compose(
  withRouter,
  withCurrentUser,
  getCommunityMembersQuery,
  viewNetworkHandler,
  connect()
)(Component);
