// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withRouter, Route } from 'react-router-dom';
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
} from './style';
import Icon from 'src/components/icons';
import NavHead from './navHead';
import DirectMessagesTab from './directMessagesTab';
import NotificationsTab from './notificationsTab';
import GlobalComposerTab from './globalComposerTab';
import { Skip, getAccessibilityActiveState } from './accessibility';
import CommunityList from './communityList';
import { NavigationContext } from 'src/routes';

const Navigation = (props: Props) => {
  const { currentUser, history } = props;
  const isMarketingPage = isViewingMarketingPage(history, currentUser);
  if (isMarketingPage) return null;

  if (!currentUser) {
    return (
      <NavigationContext.Consumer>
        {({ navigationIsOpen, setNavigationIsOpen }) => (
          <NavigationWrapper isOpen={navigationIsOpen}>
            <Overlay
              isOpen={navigationIsOpen}
              onClick={() => setNavigationIsOpen(false)}
            />

            <NavigationGrid isOpen={navigationIsOpen}>
              <Route path="/about">
                {({ match }) => (
                  <Tooltip content="Home" placement={'left'}>
                    <AvatarGrid isActive={!!match}>
                      <AvatarLink
                        to={'/about'}
                        data-cy="navbar-home"
                        onClick={() => setNavigationIsOpen(false)}
                        {...getAccessibilityActiveState(!!match)}
                      >
                        <IconWrapper>
                          <Icon glyph="logo" />
                        </IconWrapper>

                        <Label>Home</Label>
                      </AvatarLink>
                    </AvatarGrid>
                  </Tooltip>
                )}
              </Route>

              <Route path="/features">
                {({ match }) => (
                  <Tooltip content="Features" placement={'left'}>
                    <AvatarGrid isActive={!!match}>
                      <AvatarLink
                        to={'/features'}
                        data-cy="navbar-features"
                        onClick={() => setNavigationIsOpen(false)}
                        {...getAccessibilityActiveState(!!match)}
                      >
                        <IconWrapper>
                          <Icon glyph="announcement" />
                        </IconWrapper>

                        <Label>Features</Label>
                      </AvatarLink>
                    </AvatarGrid>
                  </Tooltip>
                )}
              </Route>

              <Route path="/support">
                {({ match }) => (
                  <Tooltip content="Support" placement={'left'}>
                    <AvatarGrid isActive={!!match}>
                      <AvatarLink
                        to={'/support'}
                        data-cy="navbar-support"
                        onClick={() => setNavigationIsOpen(false)}
                        {...getAccessibilityActiveState(!!match)}
                      >
                        <IconWrapper>
                          <Icon glyph="support" />
                        </IconWrapper>

                        <Label>Support</Label>
                      </AvatarLink>
                    </AvatarGrid>
                  </Tooltip>
                )}
              </Route>

              <Route path="/apps">
                {({ match }) => (
                  <Tooltip content="Apps" placement={'left'}>
                    <AvatarGrid isActive={!!match}>
                      <AvatarLink
                        to={'/apps'}
                        data-cy="navbar-apps"
                        onClick={() => setNavigationIsOpen(false)}
                        {...getAccessibilityActiveState(!!match)}
                      >
                        <IconWrapper>
                          <Icon glyph="download" />
                        </IconWrapper>

                        <Label>Apps</Label>
                      </AvatarLink>
                    </AvatarGrid>
                  </Tooltip>
                )}
              </Route>

              <Route path="/explore">
                {({ match }) => (
                  <Tooltip content="Explore" placement={'left'}>
                    <AvatarGrid isActive={!!match}>
                      <AvatarLink
                        to={'/explore'}
                        data-cy="navbar-explore"
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
                  <Tooltip content="login" placement={'left'}>
                    <AvatarGrid isActive={!!match}>
                      <AvatarLink
                        to={'/login'}
                        data-cy="navbar-login"
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

  return (
    <NavigationContext.Consumer>
      {({ navigationIsOpen, setNavigationIsOpen }) => (
        <NavigationWrapper isOpen={navigationIsOpen}>
          <NavHead {...props} />
          <Skip />

          <Overlay
            isOpen={navigationIsOpen}
            onClick={() => setNavigationIsOpen(false)}
          />

          <NavigationGrid isOpen={navigationIsOpen}>
            <GlobalComposerTab />
            <Route path="/messages">
              {({ match }) => <DirectMessagesTab isActive={!!match} />}
            </Route>
            <Route path="/notifications">
              {({ match }) => <NotificationsTab isActive={!!match} />}
            </Route>

            <Route path="/explore">
              {({ match }) => (
                <Tooltip content="Explore" placement={'left'}>
                  <AvatarGrid
                    isActive={
                      match && match.url === '/explore' && match.isExact
                    }
                  >
                    <AvatarLink
                      to={'/explore'}
                      data-cy="navbar-explore"
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
                <Tooltip content="Profile" placement={'left'}>
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
                      data-cy="navbar-profile"
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

            {currentUser && (
              <React.Fragment>
                <Divider />
                <Route path="/new/community">
                  {({ match }) => (
                    <Tooltip content="Create a community" placement={'left'}>
                      <AvatarGrid
                        isActive={
                          match &&
                          match.url === '/new/community' &&
                          match.isExact
                        }
                      >
                        <AvatarLink
                          to={'/new/community'}
                          data-cy="navbar-new-community"
                          {...getAccessibilityActiveState(
                            match &&
                              match.url === '/new/community' &&
                              match.isExact
                          )}
                        >
                          <IconWrapper>
                            <Icon glyph="plus" />
                          </IconWrapper>

                          <Label>Create a community</Label>
                        </AvatarLink>
                      </AvatarGrid>
                    </Tooltip>
                  )}
                </Route>
              </React.Fragment>
            )}
          </NavigationGrid>
        </NavigationWrapper>
      )}
    </NavigationContext.Consumer>
  );
};

export default compose(
  withCurrentUser,
  withRouter
)(Navigation);
