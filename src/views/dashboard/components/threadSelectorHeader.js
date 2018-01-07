// @flow
import React from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
import { changeActiveThread } from '../../../actions/dashboardFeed';
import { HeaderWrapper, CommunityListScroller, NarrowOnly } from '../style';
import { IconButton } from '../../../components/buttons';
import ThreadSearch from './threadSearch';
import Menu from '../../../components/menu';
import CommunityList from './communityList';

const Header = ({
  dispatch,
  filter,
  communities,
  user,
  activeCommunity,
  activeChannel,
}) => (
  <HeaderWrapper>
    <NarrowOnly>
      <Menu hasNavBar>
        <CommunityList
          communities={communities}
          user={user}
          activeCommunity={activeCommunity}
          activeChannel={activeChannel}
        />
      </Menu>
    </NarrowOnly>
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
