// @flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
// $FlowFixMe
import { connect } from 'react-redux';
import { openComposer } from '../../../actions/composer';
import { Button } from '../../../components/buttons';
import { NullThreadFeed, NullHeading } from '../style';

const EmptyThreadFeed = ({ dispatch }) => (
  <NullThreadFeed>
    <NullHeading>
      There are no conversations in this community yet...
    </NullHeading>
    <Button onClick={() => dispatch(openComposer())}>
      Start a conversation
    </Button>
  </NullThreadFeed>
);

export default connect()(EmptyThreadFeed);
