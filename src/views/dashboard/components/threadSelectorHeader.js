// @flow
import React from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
import { changeActiveThread } from '../../../actions/dashboardFeed';
import {
  HeaderWrapper,
  ComposerLeft,
  ComposeIconContainer,
  ChevronIconContainer,
} from '../style';
import { IconButton } from '../../../components/buttons';
import Icon from '../../../components/icons';

const Header = ({ dispatch }) => (
  <HeaderWrapper>
    <IconButton
      glyph={'post'}
      onClick={() => dispatch(changeActiveThread('new'))}
      tipText={'New conversation'}
      tipLocation={'bottom-left'}
    />
  </HeaderWrapper>
);

export default connect()(Header);
