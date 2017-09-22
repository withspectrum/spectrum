// @flow
import React from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
import { openComposer } from '../../../actions/composer';
import {
  CreateThreadComposer,
  ComposerLeft,
  ComposeIconContainer,
  ChevronIconContainer,
} from '../style';
import Icon from '../../../components/icons';

const Composer = ({ dispatch }) => (
  <CreateThreadComposer onClick={() => dispatch(openComposer())}>
    <ComposeIconContainer>
      <Icon glyph={'post'} size={32} />
    </ComposeIconContainer>
  </CreateThreadComposer>
);

export default connect()(Composer);
