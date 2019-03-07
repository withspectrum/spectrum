// @flow
import React from 'react';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import getCommunityMembersQuery from 'shared/graphql/queries/community/getCommunityMembers';
import { Loading } from 'src/components/loading';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { UserListItem } from 'src/components/Entities';
import Icon from 'src/components/icons';
import { withCurrentUser } from 'src/components/withCurrentUser';
import type { TeamMemberListType } from '../types';
import Tooltip from 'src/components/Tooltip';
import { List, SidebarSectionHeader, SidebarSectionHeading } from '../style';

class Component extends React.Component<TeamMemberListType> {
  render() {
    const {
      isLoading,
      hasError,
      queryVarIsChanging,
      data,
      currentUser,
    } = this.props;

    const isOwner = this.props.community.communityPermissions.isOwner;

    if (isLoading || queryVarIsChanging)
      return <Loading style={{ padding: '32px' }} />;
    if (hasError) return null;

    const { community } = data;

    const { edges: members } = community.members;
    const nodes = members
      .map(member => member && member.node)
      .filter(node => node && (node.isOwner || node.isModerator))
      .filter(Boolean)
      .sort((a, b) => {
        const bc = parseInt(b.reputation, 10);
        const ac = parseInt(a.reputation, 10);

        // sort same-reputation communities alphabetically
        if (ac === bc) {
          return a.user.name.toUpperCase() <= b.user.name.toUpperCase()
            ? -1
            : 1;
        }

        // otherwise sort by reputation
        return bc <= ac ? -1 : 1;
      });

    return (
      <React.Fragment>
        <SidebarSectionHeader>
          <SidebarSectionHeading>Team</SidebarSectionHeading>
          {isOwner && (
            <Tooltip title={'Manage team'} position="top">
              <Link to={`/${community.slug}/settings/members`}>
                <Icon glyph={'settings'} size={24} />
              </Link>
            </Tooltip>
          )}
        </SidebarSectionHeader>

        <List>
          {nodes.map(({ user }) => (
            <UserListItem
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
