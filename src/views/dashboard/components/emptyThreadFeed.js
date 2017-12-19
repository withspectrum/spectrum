// @flow
import React from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
import Link from '../../../components/link';
import { changeActiveThread } from '../../../actions/dashboardFeed';
import Icon from '../../../components/icons';
import { Button } from '../../../components/buttons';
import { NullThreadFeed, NullHeading, OutlineButton, Hint } from '../style';

const EmptyThreadFeed = ({ dispatch }) => (
  <NullThreadFeed>
    <NullHeading>Your feed's a little quiet right now...</NullHeading>
    <Button icon={'post'} onClick={() => dispatch(changeActiveThread('new'))}>
      Start a conversation
    </Button>
    <Hint>Kick your community off right!</Hint>
    <Link to={'/explore'}>
      <OutlineButton style={{ marginTop: '16px' }}>
        <Icon glyph="explore" />
        <span>Join more communities</span>
      </OutlineButton>
    </Link>
    <Hint>The more the merrier!</Hint>
  </NullThreadFeed>
);

export default connect()(EmptyThreadFeed);
