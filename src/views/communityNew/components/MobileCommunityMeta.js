// @flow
import React from 'react';
import renderTextWithLinks from 'src/helpers/render-text-with-markdown-links';
import addProtocolToString from 'shared/normalize-url';
import type { CommunityMetaType } from '../types';
import Icon from 'src/components/icons';
import { CommunityAvatar } from 'src/components/avatar';
import {
  MobileMetaContainer,
  MobileCommunityName,
  CommunityDescription,
  CommunityMetaRow,
  MetaLinksContainer,
  OnlineDot,
} from '../style';

export const MobileCommunityMeta = (props: CommunityMetaType) => {
  const { community } = props;

  return (
    <MobileMetaContainer>
      <Icon glyph={'view-back'} size={28} />
      <div style={{ width: '8px' }} />
      <CommunityAvatar size={24} community={community} />
      <MobileCommunityName>{community.name}</MobileCommunityName>
    </MobileMetaContainer>
  );
};
