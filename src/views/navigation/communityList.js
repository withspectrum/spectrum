// @flow
import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import { Route } from 'react-router-dom';
import Tooltip from 'src/components/tooltip';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { getCurrentUserCommunityConnection } from 'shared/graphql/queries/user/getUserCommunityConnection';
import { isDesktopApp } from 'src/helpers/desktop-app-utils';
import { getAccessibilityActiveState } from './accessibility';
import {
  AvatarGrid,
  AvatarLink,
  Avatar,
  Shortcut,
  Label,
  BlackDot,
} from './style';

const CommunityList = (props: Props) => {
  const { data, history, sidenavIsOpen, setNavigationIsOpen } = props;
  const { user } = data;

  if (!user) return null;

  const { communityConnection } = user;
  const { edges } = communityConnection;
  const communities = edges.map(edge => edge && edge.node);

  const sorted = communities.slice().sort((a, b) => {
    const bc = parseInt(b.communityPermissions.reputation, 10);
    const ac = parseInt(a.communityPermissions.reputation, 10);

    // sort same-reputation communities alphabetically
    if (ac === bc) {
      return a.name.toUpperCase() <= b.name.toUpperCase() ? -1 : 1;
    }

    // otherwise sort by reputation
    return bc <= ac ? -1 : 1;
  });

  useEffect(() => {
    const handleCommunitySwitch = e => {
      const ONE = 49;
      const TWO = 50;
      const THREE = 51;
      const FOUR = 52;
      const FIVE = 53;
      const SIX = 54;
      const SEVEN = 55;
      const EIGHT = 56;
      const NINE = 57;

      const possibleKeys = [
        ONE,
        TWO,
        THREE,
        FOUR,
        FIVE,
        SIX,
        SEVEN,
        EIGHT,
        NINE,
      ];

      const appControlKey = e.metaKey;

      if (appControlKey) {
        const index = possibleKeys.indexOf(e.keyCode);
        if (index >= 0) {
          const community = sorted[index];
          if (!community) return;
          setNavigationIsOpen(false);
          return history.push(
            `/${community.slug}?tab=${
              community.watercoolerId ? 'chat' : 'posts'
            }`
          );
        }
      }
    };

    props.subscribeToUpdatedCommunities();

    isDesktopApp() &&
      window.addEventListener('keydown', handleCommunitySwitch, false);
    return () =>
      window.removeEventListener('keydown', handleCommunitySwitch, false);
  }, []);

  const appControlSymbol = '⌘';

  return sorted.map((community, index) => {
    if (!community) return null;

    const { communityPermissions } = community;
    const { isMember, isBlocked } = communityPermissions;
    if (!isMember || isBlocked) return null;

    return (
      <Route path="/:communitySlug" key={community.id}>
        {({ match }) => (
          <Tooltip content={community.name} placement={'left'}>
            <AvatarGrid
              isActive={
                match &&
                match.params &&
                match.params.communitySlug === community.slug
              }
            >
              <AvatarLink
                to={`/${community.slug}?tab=${
                  community.watercoolerId ? 'chat' : 'posts'
                }`}
                onClick={() => setNavigationIsOpen(false)}
                {...getAccessibilityActiveState(
                  match &&
                    match.params &&
                    match.params.communitySlug === community.slug
                )}
              >
                <Avatar
                  src={community.profilePhoto}
                  size={sidenavIsOpen ? 32 : 36}
                />
                {new Date(community.lastActive) >
                  new Date(community.communityPermissions.lastSeen) && (
                  <BlackDot />
                )}

                <Label>{community.name}</Label>

                {index < 9 && isDesktopApp() && (
                  <Shortcut>
                    {appControlSymbol}
                    {index + 1}
                  </Shortcut>
                )}
              </AvatarLink>
            </AvatarGrid>
          </Tooltip>
        )}
      </Route>
    );
  });
};
export default compose(
  getCurrentUserCommunityConnection,
  viewNetworkHandler
)(CommunityList);
