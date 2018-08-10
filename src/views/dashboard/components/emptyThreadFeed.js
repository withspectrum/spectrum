// @flow
import React from 'react';
import { connect } from 'react-redux';
import Link from 'src/components/link';
import { changeActiveThread } from 'src/actions/dashboardFeed';
import Icon from 'src/components/icon';
import { Button } from 'src/components/button';
import { NullThreadFeed, NullHeading, OutlineButton, Hint } from '../style';

const EmptyThreadFeed = ({ dispatch }) => (
  <NullThreadFeed>
    <NullHeading>
      Your feed's a little quiet right now, but don't worry...
    </NullHeading>
    <NullHeading>We've got recommendations!</NullHeading>
    <Hint>Kick your community off right!</Hint>
    <Button icon={'post'} onClick={() => dispatch(changeActiveThread('new'))}>
      Post your first thread
    </Button>
    <Hint>Find new friends and great conversations!</Hint>
    <Link to={'/explore'}>
      <OutlineButton>
        <Icon glyph="explore" />
        <span>Join more communities</span>
      </OutlineButton>
    </Link>
  </NullThreadFeed>
);

export default connect()(EmptyThreadFeed);
