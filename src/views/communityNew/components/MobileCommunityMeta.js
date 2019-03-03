// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
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

const Component = (props: CommunityMetaType) => {
  const { community, history } = props;
  const goBack = () => history.goBack();

  return (
    <MobileMetaContainer>
      <Icon onClick={goBack} glyph={'view-back'} size={28} />
      <div style={{ width: '8px' }} />
      <CommunityAvatar size={24} community={community} />
      <MobileCommunityName>{community.name}</MobileCommunityName>
    </MobileMetaContainer>
  );
};

export const MobileCommunityMeta = compose(withRouter)(Component);
