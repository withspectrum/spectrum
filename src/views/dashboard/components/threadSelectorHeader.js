// @flow
import React from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
import { changeActiveThread } from '../../../actions/dashboardFeed';
import { HeaderWrapper } from '../style';
import { IconButton } from '../../../components/buttons';
import ThreadSearch from './threadSearch';

const Header = ({ dispatch, filter }) => (
  <HeaderWrapper>
    <ThreadSearch filter={filter} />
    <IconButton
      glyph={'post'}
      onClick={() => dispatch(changeActiveThread('new'))}
      tipText={'New conversation'}
      tipLocation={'bottom-left'}
    />
  </HeaderWrapper>
);

export default connect()(Header);
