// @flow
import React from 'react';
import type { CommunityMetaType } from '../types';
import Icon from 'src/components/icons';
import { CommunityAvatar } from 'src/components/avatar';
import { MobileMetaContainer, MobileCommunityName } from '../style';
import { NavigationContext } from 'src/routes';

export const MobileCommunityMeta = (props: CommunityMetaType) => {
  const { community } = props;

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
          <CommunityAvatar size={24} community={community} />
          <MobileCommunityName>{community.name}</MobileCommunityName>
        </MobileMetaContainer>
      )}
    </NavigationContext.Consumer>
  );
};
