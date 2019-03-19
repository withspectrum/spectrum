// @flow
import React from 'react';
import Icon from 'src/components/icons';
import Tooltip from 'src/components/tooltip';
import { NavigationContext } from 'src/routes';
import { AvatarGrid, AvatarLink, Label, IconWrapper } from './style';

const GlobalComposerTab = () => {
  return (
    <NavigationContext.Consumer>
      {({ setNavigationIsOpen }) => (
        <Tooltip content="New post" placement={'left'}>
          <AvatarGrid>
            <AvatarLink
              to={{ pathname: '/new/thread', state: { modal: true } }}
              data-cy="navigation-composer"
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
  );
};

export default GlobalComposerTab;
