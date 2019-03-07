// @flow
import React from 'react';
import type { ChannelMetaType } from '../types';
import Icon from 'src/components/icons';
import { CommunityAvatar } from 'src/components/avatar';
import { MobileMetaContainer, MobileName } from '../style';
import { NavigationContext } from 'src/routes';

export const MobileChannelMeta = (props: ChannelMetaType) => {
  const { channel } = props;

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
          <CommunityAvatar size={24} community={channel.community} />
          <MobileName>{channel.name}</MobileName>
        </MobileMetaContainer>
      )}
    </NavigationContext.Consumer>
  );
};
