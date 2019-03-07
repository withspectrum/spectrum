// @flow
import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import { Route } from 'react-router-dom';
import Tooltip from 'src/components/Tooltip';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { getCurrentUserCommunityConnection } from 'shared/graphql/queries/user/getUserCommunityConnection';
import { storeItem } from 'src/helpers/localStorage';
import { LAST_ACTIVE_COMMUNITY_KEY } from 'src/views/homeViewRedirect';
import { isDesktopApp } from 'src/helpers/desktop-app-utils';
import { getAccessibilityActiveState } from './Accessibility';
import { AvatarGrid, AvatarLink, Avatar, Shortcut, Label } from './style';

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

      const appControlKey = isDesktopApp() ? e.metaKey : e.altKey;

      if (appControlKey) {
        const index = possibleKeys.indexOf(e.keyCode);
        if (index >= 0) {
          const community = sorted[index];
          if (!community) return;
          setNavigationIsOpen(false);
          storeItem(LAST_ACTIVE_COMMUNITY_KEY, community.id);
          return history.push(`/${community.slug}`);
        }
      }
    };

    window.addEventListener('keydown', handleCommunitySwitch, false);
    return () =>
      window.removeEventListener('keydown', handleCommunitySwitch, false);
  }, []);

  const handleCommunityClick = (id: string) => () => {
    storeItem(LAST_ACTIVE_COMMUNITY_KEY, id);
    setNavigationIsOpen(false);
  };

  const appControlSymbol = isDesktopApp() ? '⌘' : '⌥';

  return sorted.map((community, index) => {
    if (!community) return null;

    const { communityPermissions } = community;
    const { isMember, isBlocked } = communityPermissions;
    if (!isMember || isBlocked) return null;

    return (
      <Route path="/:communitySlug">
        {({ match }) => (
          <Tooltip title={community.name} key={community.id}>
            <AvatarGrid
              isActive={
                match &&
                match.params &&
                match.params.communitySlug === community.slug
              }
            >
              <AvatarLink
                to={`/${community.slug}`}
                onClick={handleCommunityClick(community.id)}
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

                <Label>{community.name}</Label>

                {index < 9 && (
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
