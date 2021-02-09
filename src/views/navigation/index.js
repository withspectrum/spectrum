// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withRouter, Route, type History } from 'react-router-dom';
import Tooltip from 'src/components/tooltip';
import { UserAvatar } from 'src/components/avatar';
import { isViewingMarketingPage } from 'src/helpers/is-viewing-marketing-page';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  Overlay,
  NavigationWrapper,
  NavigationGrid,
  AvatarGrid,
  AvatarLink,
  Label,
  IconWrapper,
  Divider,
  DesktopMenuIconsCover,
} from './style';
import Icon from 'src/components/icon';
import NavHead from './navHead';
import DirectMessagesTab from './directMessagesTab';
import NotificationsTab from './notificationsTab';
import GlobalComposerTab from './globalComposerTab';
import { Skip, getAccessibilityActiveState } from './accessibility';
import CommunityList from './communityList';
import { NavigationContext } from 'src/helpers/navigation-context';
import { MIN_WIDTH_TO_EXPAND_NAVIGATION } from 'src/components/layout';

type Props = {
  history: History,
  currentUser?: Object,
  isLoadingCurrentUser: boolean,
};

const Navigation = (props: Props) => {
  const { currentUser, history, isLoadingCurrentUser } = props;
  const isMarketingPage = isViewingMarketingPage(history, currentUser);
  if (isMarketingPage) return null;
  const isWideViewport =
    window && window.innerWidth > MIN_WIDTH_TO_EXPAND_NAVIGATION;
  if (!isLoadingCurrentUser && !currentUser) {
    return (
      <NavigationContext.Consumer>
        {({ navigationIsOpen, setNavigationIsOpen }) => (
          <NavigationWrapper data-cy="navigation-bar" isOpen={navigationIsOpen}>
            <Overlay
              isOpen={navigationIsOpen}
              onClick={() => setNavigationIsOpen(false)}
            />

            <NavigationGrid isOpen={navigationIsOpen}>
              <DesktopMenuIconsCover />

              <Route path="/explore">
                {({ match }) => (
                  <Tooltip
                    content="Explore"
                    placement={'left'}
                    isEnabled={!isWideViewport}
                  >
                    <AvatarGrid isActive={!!match}>
                      <AvatarLink
                        to={'/explore'}
                        data-cy="navigation-explore"
                        onClick={() => setNavigationIsOpen(false)}
                        {...getAccessibilityActiveState(!!match)}
                      >
                        <IconWrapper>
                          <Icon glyph="explore" />
                        </IconWrapper>

                        <Label>Explore</Label>
                      </AvatarLink>
                    </AvatarGrid>
                  </Tooltip>
                )}
              </Route>

              <Divider />

              <Route path="/login">
                {({ match }) => (
                  <Tooltip
                    content="Log in or sign up"
                    placement={'left'}
                    isEnabled={!isWideViewport}
                  >
                    <AvatarGrid isActive={!!match}>
                      <AvatarLink
                        to={'/login'}
                        data-cy="navigation-login"
                        onClick={() => setNavigationIsOpen(false)}
                        {...getAccessibilityActiveState(!!match)}
                      >
                        <IconWrapper>
                          <Icon glyph="door-enter" />
                        </IconWrapper>

                        <Label>Log in or sign up</Label>
                      </AvatarLink>
                    </AvatarGrid>
                  </Tooltip>
                )}
              </Route>
            </NavigationGrid>
          </NavigationWrapper>
        )}
      </NavigationContext.Consumer>
    );
  }

  if (currentUser) {
    return (
      <NavigationContext.Consumer>
        {({ navigationIsOpen, setNavigationIsOpen }) => (
          <NavigationWrapper data-cy="navigation-bar" isOpen={navigationIsOpen}>
            <NavHead {...props} />
            <Skip />

            <Overlay
              isOpen={navigationIsOpen}
              onClick={() => setNavigationIsOpen(false)}
            />

            <NavigationGrid isOpen={navigationIsOpen}>
              <DesktopMenuIconsCover />
              <GlobalComposerTab />
              <Route path="/messages">
                {({ match }) => <DirectMessagesTab isActive={!!match} />}
              </Route>
              <Route path="/notifications">
                {({ match }) => <NotificationsTab isActive={!!match} />}
              </Route>

              <Route path="/explore">
                {({ match }) => (
                  <Tooltip
                    content="Explore"
                    placement={'left'}
                    isEnabled={!isWideViewport}
                  >
                    <AvatarGrid
                      isActive={
                        match && match.url === '/explore' && match.isExact
                      }
                    >
                      <AvatarLink
                        to={'/explore'}
                        data-cy="navigation-explore"
                        onClick={() => setNavigationIsOpen(false)}
                        {...getAccessibilityActiveState(
                          match && match.url === '/explore' && match.isExact
                        )}
                      >
                        <IconWrapper>
                          <Icon glyph="explore" />
                        </IconWrapper>

                        <Label>Explore</Label>
                      </AvatarLink>
                    </AvatarGrid>
                  </Tooltip>
                )}
              </Route>

              <Route path="/users/:username">
                {({ match }) => (
                  <Tooltip
                    content="Profile"
                    placement={'left'}
                    isEnabled={!isWideViewport}
                  >
                    <AvatarGrid
                      isActive={
                        match &&
                        match.params &&
                        match.params.username === currentUser.username
                      }
                      style={{ marginTop: '4px' }}
                    >
                      <AvatarLink
                        to={'/me'}
                        data-cy="navigation-profile"
                        onClick={() => setNavigationIsOpen(false)}
                        {...getAccessibilityActiveState(
                          history.location.pathname ===
                            `/users/${currentUser.username}`
                        )}
                      >
                        <UserAvatar
                          size={32}
                          showOnlineStatus={false}
                          user={currentUser}
                          isClickable={false}
                          showHoverProfile={false}
                        />
                        <Label>Profile</Label>
                      </AvatarLink>
                    </AvatarGrid>
                  </Tooltip>
                )}
              </Route>

              <Divider />

              <CommunityList
                setNavigationIsOpen={setNavigationIsOpen}
                navigationIsOpen={navigationIsOpen}
                {...props}
              />
            </NavigationGrid>
          </NavigationWrapper>
        )}
      </NavigationContext.Consumer>
    );
  }

  return <NavigationWrapper />;
};

export default compose(
  withCurrentUser,
  withRouter
)(Navigation);
