// @flow
import React from 'react';
import { Route } from 'react-router-dom';
import Icon from 'src/components/icons';
import Tooltip from 'src/components/Tooltip';
import { NavigationContext } from 'src/routes';
import { AvatarGrid, AvatarLink, Label, IconWrapper, RedDot } from './style';

const GlobalComposerTab = () => {
  return (
    <Route path="/new/thread">
      {({ match }) => (
        <NavigationContext.Consumer>
          {({ setNavigationIsOpen }) => (
            <Tooltip title="New post">
              <AvatarGrid>
                <AvatarLink
                  to={{ pathname: '/new/thread', state: { modal: true } }}
                  data-cy="navbar-composer"
                  onClick={() => setNavigationIsOpen(false)}
                >
                  <IconWrapper>
                    <Icon glyph="post" />
                  </IconWrapper>

                  <Label>New Post</Label>
                </AvatarLink>
              </AvatarGrid>
            </Tooltip>
          )}
        </NavigationContext.Consumer>
      )}
    </Route>
  );
};

export default GlobalComposerTab;
