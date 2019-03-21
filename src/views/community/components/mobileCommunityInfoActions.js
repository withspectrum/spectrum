// @flow
import React from 'react';
import compose from 'recompose/compose';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';
import { openModal } from 'src/actions/modals';
import Icon from 'src/components/icon';
import {
  SidebarSectionHeader,
  SidebarSectionHeading,
  List,
  ListItem,
  ListItemLink,
  ListItemLabel,
  ListItemContent,
  NameWarn,
} from '../style';

type Props = {
  dispatch: Dispatch<Object>,
  community: CommunityInfoType,
};

const Component = (props: Props) => {
  const { community, dispatch } = props;
  const { communityPermissions } = community;
  const { isMember, isOwner, isModerator } = communityPermissions;
  const isTeamMember = isOwner || isModerator;

  const leaveCommunity = () =>
    dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: community.id,
        entity: 'team-member-leaving-community',
        message: 'Are you sure you want to leave this community?',
        buttonLabel: 'Leave Community',
      })
    );

  if (!isMember && !isOwner && !isModerator) return null;

  return (
    <React.Fragment>
      <SidebarSectionHeader>
        <SidebarSectionHeading>More</SidebarSectionHeading>
      </SidebarSectionHeader>

      <List>
        {isTeamMember && (
          <ListItemLink to={`/${community.slug}/settings`}>
            <ListItemContent>
              <ListItemLabel>Community settings</ListItemLabel>
            </ListItemContent>
            <Icon glyph="view-forward" size={24} />
          </ListItemLink>
        )}

        {!isOwner && isMember && (
          <ListItem onClick={leaveCommunity}>
            <ListItemContent>
              <NameWarn>Leave community</NameWarn>
            </ListItemContent>
            <Icon glyph="door-leave" size={24} />
          </ListItem>
        )}
      </List>
    </React.Fragment>
  );
};

export const MobileCommunityInfoActions = compose(connect())(Component);
