// @flow
import React from 'react';
import type { CommunityMetaType } from '../types';
import Icon from 'src/components/icons';
import { CommunityAvatar } from 'src/components/avatar';
import { MobileMetaContainer, MobileCommunityName } from '../style';
import { SidenavContext } from '../context';

export const MobileCommunityMeta = (props: CommunityMetaType) => {
  const { community } = props;

  return (
    <SidenavContext.Consumer>
      {({ setSidenavIsOpen }) => (
        <MobileMetaContainer>
          <Icon
            onClick={() => setSidenavIsOpen(true)}
            glyph={'menu'}
            size={28}
          />
          <div style={{ width: '8px' }} />
          <CommunityAvatar size={24} community={community} />
          <MobileCommunityName>{community.name}</MobileCommunityName>
        </MobileMetaContainer>
      )}
    </SidenavContext.Consumer>
  );
};
