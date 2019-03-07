// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withRouter, Route } from 'react-router-dom';
import Tooltip from 'src/components/Tooltip';
import { UserAvatar } from 'src/components/avatar';
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
import NavHead from './NavHead';
import DirectMessagesTab from './DirectMessagesTab';
import NotificationsTab from './NotificationsTab';
import GlobalComposerTab from './GlobalComposerTab';
import { Skip, getAccessibilityActiveState } from './Accessibility';
import CommunityList from './CommunityList';
import { NavigationContext } from 'src/routes';

const Navigation = (props: Props) => {
  const { currentUser, history } = props;

  if (!currentUser) return <div />;

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
            <DirectMessagesTab />
            <NotificationsTab />

            <Route path="/explore">
              {({ match }) => (
                <Tooltip title="Explore">
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
                <Tooltip title="Profile">
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
};

export default compose(
  withCurrentUser,
  withRouter
)(Navigation);
