// @flow
import React from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
import { changeActiveThread } from '../../../actions/dashboardFeed';
import { Button } from '../../../components/buttons';
import { NullThreadFeed, NullHeading } from '../style';

const EmptyThreadFeed = ({ dispatch }) => (
  <NullThreadFeed>
    <NullHeading>
      There are no conversations in this community yet...
    </NullHeading>
    <Button onClick={() => dispatch(changeActiveThread('new'))}>
      Start a conversation
    </Button>
  </NullThreadFeed>
);

export default connect()(EmptyThreadFeed);
