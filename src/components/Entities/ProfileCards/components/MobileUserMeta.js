// @flow
import React from 'react';
import type { UserMetaType } from '../types';
import Icon from 'src/components/icons';
import { UserAvatar } from 'src/components/avatar';
import { MobileMetaContainer, MobileName } from '../style';
import { NavigationContext } from 'src/routes';

export const MobileUserMeta = (props: UserMetaType) => {
  const { user } = props;

  return (
    <NavigationContext.Consumer>
      {({ setNavigationIsOpen }) => (
        <MobileMetaContainer>
          <Icon
            onClick={() => setNavigationIsOpen(true)}
            glyph={'menu'}
            size={32}
          />
          <div style={{ width: '8px' }} />
          <UserAvatar showOnlineStatus={false} size={24} user={user} />
          <MobileName>{user.name}</MobileName>
        </MobileMetaContainer>
      )}
    </NavigationContext.Consumer>
  );
};
