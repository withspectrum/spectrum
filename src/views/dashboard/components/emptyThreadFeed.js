// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Icon from 'src/components/icons';
import { Button } from 'src/components/buttons';
import { NullThreadFeed, NullHeading, OutlineButton, Hint } from '../style';
import { isMobile } from 'src/helpers/utils';

const EmptyThreadFeed = ({ dispatch }) => (
  <NullThreadFeed>
    <NullHeading>
      Your feed's a little quiet right now, but don't worry...
    </NullHeading>
    <NullHeading>We've got recommendations!</NullHeading>
    <Hint>Kick your community off right!</Hint>
    {/* dispatch activethread to 'new'? */}
    <Link to={'/new/thread'}>
      <Button icon={'post'}>Post your first thread</Button>
    </Link>
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
