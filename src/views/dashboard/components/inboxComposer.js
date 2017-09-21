// @flow
import React from 'react';
import {
  CreateThreadComposer,
  ComposerLeft,
  ComposeIconContainer,
  ChevronIconContainer,
} from '../style';
import Icon from '../../../components/icons';

export default () => (
  <CreateThreadComposer
    to={{
      pathname: window.location.pathname,
      search: `?t=new`,
    }}
  >
    <ComposeIconContainer>
      <Icon glyph={'post'} size={32} />
    </ComposeIconContainer>
  </CreateThreadComposer>
);
