// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { ErrorBoundary } from 'src/components/error';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import getCommunityMembersQuery, {
  type GetCommunityMembersType,
} from 'shared/graphql/queries/community/getCommunityMembers';
import { Loading } from 'src/components/loading';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import { UserListItem } from 'src/components/entities';
import Icon from 'src/components/icon';
import { withCurrentUser } from 'src/components/withCurrentUser';
import Tooltip from 'src/components/tooltip';
import { WhiteIconButton } from 'src/components/button';
import { List, SidebarSectionHeader, SidebarSectionHeading } from '../style';

type Props = {
  ...$Exact<ViewNetworkHandlerType>,
  currentUser: ?UserInfoType,
  community: GetCommunityType,
  data: {
    community: GetCommunityMembersType,
  },
};

class Component extends React.Component<Props> {
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
      return (
        <React.Fragment>
          <SidebarSectionHeader>
            <SidebarSectionHeading>Team</SidebarSectionHeading>
          </SidebarSectionHeader>
          <Loading style={{ padding: '32px' }} />
        </React.Fragment>
      );

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
            <Tooltip content={'Manage team'}>
              <span>
                <WhiteIconButton to={`/${community.slug}/settings/members`}>
                  <Icon glyph={'settings'} size={24} />
                </WhiteIconButton>
              </span>
            </Tooltip>
          )}
        </SidebarSectionHeader>

        <List>
          {nodes.map(({ user }) => (
            <ErrorBoundary key={user.id}>
              <UserListItem
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
            </ErrorBoundary>
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
