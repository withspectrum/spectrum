// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { openModal } from 'src/actions/modals';
import Icon from 'src/components/icons';
import {
  SidebarSectionHeader,
  SidebarSectionHeading,
  List,
  ChannelListItem,
  ChannelListItemContent,
  ChannelName,
  Name,
  ListItem,
  ListItemContent,
  NameWarn,
} from '../style';

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
          <ChannelListItem to={`/${community.slug}/settings`}>
            <ListItemContent>
              <Name>Community settings</Name>
            </ListItemContent>
            <Icon glyph="view-forward" size={24} />
          </ChannelListItem>
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
