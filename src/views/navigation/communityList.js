// @flow
import React, { useEffect } from 'react';
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
import usePrevious from 'src/hooks/usePrevious';

type Props = {
  data: {
    user: GetUserCommunityConnectionType,
  },
  history: History,
  sidenavIsOpen: boolean,
  setNavigationIsOpen: Function,
  subscribeToUpdatedCommunities: Function,
};

const CommunityListItem = props => {
  const { isActive, community, sidenavIsOpen, index, onClick } = props;
  // NOTE(@mxstbr): This is a really hacky way to ensure the "new activity" dot
  // does not show up when switching from a community that new activity was in
  // while you were looking at it.
  const previousActive = usePrevious(usePrevious(usePrevious(isActive)));

  const appControlSymbol = '⌘';

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
          {isActive === false &&
            previousActive === false &&
            community.lastActive &&
            community.communityPermissions.lastSeen &&
            new Date(community.lastActive) >
              new Date(community.communityPermissions.lastSeen) && <BlackDot />}

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
  );
};

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
