// @flow
import React from 'react';
import compose from 'recompose/compose';
import { Route, type History } from 'react-router-dom';
import Tooltip from 'src/components/tooltip';
import { MIN_WIDTH_TO_EXPAND_NAVIGATION } from 'src/components/layout';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { ErrorBoundary } from 'src/components/error';
import {
  getCurrentUserCommunityConnection,
  type GetUserCommunityConnectionType,
} from 'shared/graphql/queries/user/getUserCommunityConnection';
import { getAccessibilityActiveState } from './accessibility';
import { AvatarGrid, AvatarLink, Avatar, Label } from './style';

type Props = {
  data: {
    user: GetUserCommunityConnectionType,
  },
  history: History,
  sidenavIsOpen: boolean,
  setNavigationIsOpen: Function,
};

const CommunityListItem = props => {
  const { isActive, community, sidenavIsOpen, onClick } = props;

  const isWideViewport =
    window && window.innerWidth > MIN_WIDTH_TO_EXPAND_NAVIGATION;

  return (
    <Tooltip
      content={community.name}
      placement={'left'}
      isEnabled={!isWideViewport}
    >
      <AvatarGrid isActive={isActive}>
        <AvatarLink
          to={`/${community.slug}?tab=posts`}
          onClick={onClick}
          {...getAccessibilityActiveState(isActive)}
        >
          <Avatar src={community.profilePhoto} size={sidenavIsOpen ? 32 : 36} />

          <Label>{community.name}</Label>
        </AvatarLink>
      </AvatarGrid>
    </Tooltip>
  );
};

const CommunityList = (props: Props) => {
  const { data, sidenavIsOpen, setNavigationIsOpen } = props;
  const { user } = data;

  if (!user) return null;

  const { communityConnection } = user;
  const { edges } = communityConnection;
  const communities = edges.map(edge => edge && edge.node);

  const sorted = communities.slice();

  return sorted.map((community, index) => {
    if (!community) return null;

    const { communityPermissions } = community;
    const { isMember, isBlocked } = communityPermissions;
    if (!isMember || isBlocked) return null;

    return (
      <ErrorBoundary key={community.id}>
        <Route path="/:communitySlug">
          {({ match }) => {
            const isActive =
              match &&
              match.params &&
              match.params.communitySlug === community.slug;

            return (
              <CommunityListItem
                isActive={isActive}
                community={community}
                index={index}
                sidenavIsOpen={sidenavIsOpen}
                onClick={() => setNavigationIsOpen(false)}
              />
            );
          }}
        </Route>
      </ErrorBoundary>
    );
  });
};
export default compose(
  getCurrentUserCommunityConnection,
  viewNetworkHandler
)(CommunityList);
